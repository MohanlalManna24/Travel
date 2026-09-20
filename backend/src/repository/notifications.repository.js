import pool from "../db/db.js";

// Ensure table exists dynamically on boot
export const ensureNotificationsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        notification_code VARCHAR(50) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        category ENUM('Inquiry', 'Booking', 'Feedback', 'System', 'Alert', 'Promotional') NOT NULL DEFAULT 'Inquiry',
        priority ENUM('Low', 'Medium', 'High', 'Urgent') NOT NULL DEFAULT 'Medium',
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        user_id BIGINT UNSIGNED NULL,
        user_name VARCHAR(150) NULL,
        user_email VARCHAR(150) NULL,
        user_phone VARCHAR(50) NULL,
        user_avatar VARCHAR(300) NULL,
        user_role VARCHAR(50) NULL DEFAULT 'Traveler',
        entity_type VARCHAR(50) NULL,
        entity_id VARCHAR(100) NULL,
        entity_name VARCHAR(200) NULL,
        reply_sent_at DATETIME NULL,
        reply_channel VARCHAR(50) NULL,
        reply_subject VARCHAR(255) NULL,
        reply_message TEXT NULL,
        replied_by VARCHAR(100) NULL DEFAULT 'Administrator',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_notification_code (notification_code),
        INDEX idx_category (category),
        INDEX idx_priority (priority),
        INDEX idx_is_read (is_read),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (err) {
    console.error("Notifications table auto-init notice:", err.message);
  }
};

// Initial trigger
ensureNotificationsTable();

// Helper to map DB row to unified frontend structure
export const mapNotificationRow = (row) => {
  if (!row) return null;

  let feedbackReply = null;
  if (row.reply_sent_at || row.reply_message) {
    feedbackReply = {
      sentAt: row.reply_sent_at || row.updated_at,
      channel: row.reply_channel || "Email",
      subject: row.reply_subject || "",
      message: row.reply_message || "",
      repliedBy: row.replied_by || "Administrator",
    };
  }

  return {
    id: row.notification_code || `NOTIF-${row.id}`,
    db_id: row.id,
    notificationCode: row.notification_code,
    title: row.title,
    message: row.message,
    category: row.category || "Inquiry",
    priority: row.priority || "Medium",
    isRead: Boolean(row.is_read),
    user: {
      id: row.user_id,
      name: row.user_name || "Valued Traveler",
      email: row.user_email || "",
      phone: row.user_phone || "",
      avatar:
        row.user_avatar ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop",
      role: row.user_role || "Traveler",
    },
    relatedEntity: {
      type: row.entity_type || "System",
      id: row.entity_id || "",
      name: row.entity_name || "",
    },
    feedbackReply,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const getAllNotifications = async () => {
  await ensureNotificationsTable();
  const [rows] = await pool.query(
    "SELECT * FROM notifications ORDER BY created_at DESC"
  );
  return rows.map(mapNotificationRow);
};

export const getNotificationByIdOrCode = async (idOrCode) => {
  await ensureNotificationsTable();
  let query = "SELECT * FROM notifications WHERE notification_code = ? LIMIT 1";
  let params = [idOrCode];

  if (!isNaN(idOrCode)) {
    query = "SELECT * FROM notifications WHERE id = ? OR notification_code = ? LIMIT 1";
    params = [idOrCode, idOrCode];
  }

  const [rows] = await pool.query(query, params);
  if (rows.length === 0) return null;
  return mapNotificationRow(rows[0]);
};

export const createNotification = async (data) => {
  await ensureNotificationsTable();
  const {
    notificationCode,
    title,
    message,
    category = "Inquiry",
    priority = "Medium",
    isRead = false,
    userId = null,
    user = {},
    userName,
    userEmail,
    userPhone,
    userAvatar,
    userRole,
    relatedEntity = {},
    entityType,
    entityId,
    entityName,
  } = data;

  const code =
    notificationCode ||
    data.id ||
    `NOTIF-${Math.floor(100 + Math.random() * 900)}`;

  const uName = userName || user.name || "Customer";
  const uEmail = userEmail || user.email || "";
  const uPhone = userPhone || user.phone || "";
  const uAvatar =
    userAvatar ||
    user.avatar ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop";
  const uRole = userRole || user.role || "Traveler";

  const eType = entityType || relatedEntity.type || "General";
  const eId = entityId || relatedEntity.id || "";
  const eName = entityName || relatedEntity.name || "";

  const [result] = await pool.query(
    `INSERT INTO notifications (
      notification_code, title, message, category, priority, is_read,
      user_id, user_name, user_email, user_phone, user_avatar, user_role,
      entity_type, entity_id, entity_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      code,
      title,
      message,
      category,
      priority,
      isRead ? 1 : 0,
      userId || user.id || null,
      uName,
      uEmail,
      uPhone,
      uAvatar,
      uRole,
      eType,
      eId,
      eName,
    ]
  );

  return getNotificationByIdOrCode(result.insertId);
};

export const updateNotification = async (idOrCode, updateData) => {
  await ensureNotificationsTable();
  const existing = await getNotificationByIdOrCode(idOrCode);
  if (!existing) return null;

  const fields = [];
  const values = [];

  if (updateData.title !== undefined) {
    fields.push("title = ?");
    values.push(updateData.title);
  }
  if (updateData.message !== undefined) {
    fields.push("message = ?");
    values.push(updateData.message);
  }
  if (updateData.category !== undefined) {
    fields.push("category = ?");
    values.push(updateData.category);
  }
  if (updateData.priority !== undefined) {
    fields.push("priority = ?");
    values.push(updateData.priority);
  }
  if (updateData.isRead !== undefined || updateData.is_read !== undefined) {
    fields.push("is_read = ?");
    values.push(updateData.isRead ?? updateData.is_read ? 1 : 0);
  }

  // User snapshot updates
  if (updateData.user?.name || updateData.userName) {
    fields.push("user_name = ?");
    values.push(updateData.userName || updateData.user?.name);
  }
  if (updateData.user?.email || updateData.userEmail) {
    fields.push("user_email = ?");
    values.push(updateData.userEmail || updateData.user?.email);
  }
  if (updateData.user?.phone || updateData.userPhone) {
    fields.push("user_phone = ?");
    values.push(updateData.userPhone || updateData.user?.phone);
  }

  if (fields.length === 0) return existing;

  values.push(existing.db_id);
  await pool.query(
    `UPDATE notifications SET ${fields.join(", ")} WHERE id = ?`,
    values
  );

  return getNotificationByIdOrCode(existing.db_id);
};

export const setNotificationReadStatus = async (idOrCode, isRead = true) => {
  await ensureNotificationsTable();
  const existing = await getNotificationByIdOrCode(idOrCode);
  if (!existing) return null;

  await pool.query(
    "UPDATE notifications SET is_read = ? WHERE id = ?",
    [isRead ? 1 : 0, existing.db_id]
  );

  return getNotificationByIdOrCode(existing.db_id);
};

export const markAllNotificationsRead = async () => {
  await ensureNotificationsTable();
  await pool.query("UPDATE notifications SET is_read = 1 WHERE is_read = 0");
  return true;
};

export const saveNotificationReply = async (idOrCode, replyData) => {
  await ensureNotificationsTable();
  const existing = await getNotificationByIdOrCode(idOrCode);
  if (!existing) return null;

  const {
    channel = "Email & SMS",
    subject = "Response from Ghure Ashi",
    message = "",
    repliedBy = "Administrator",
  } = replyData;

  const sentAt = new Date();

  await pool.query(
    `UPDATE notifications 
     SET reply_sent_at = ?, reply_channel = ?, reply_subject = ?, reply_message = ?, replied_by = ?, is_read = 1 
     WHERE id = ?`,
    [sentAt, channel, subject, message, repliedBy, existing.db_id]
  );

  return getNotificationByIdOrCode(existing.db_id);
};

export const deleteNotification = async (idOrCode) => {
  await ensureNotificationsTable();
  const existing = await getNotificationByIdOrCode(idOrCode);
  if (!existing) return false;

  await pool.query("DELETE FROM notifications WHERE id = ?", [existing.db_id]);
  return true;
};

export const bulkDeleteNotifications = async (ids = []) => {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  await ensureNotificationsTable();

  const numericIds = ids.filter((id) => !isNaN(Number(id))).map(Number);
  const codeIds = ids.map(String);

  const [result] = await pool.query(
    "DELETE FROM notifications WHERE id IN (?) OR notification_code IN (?)",
    [numericIds.length > 0 ? numericIds : [-1], codeIds.length > 0 ? codeIds : ["__none__"]]
  );
  return result.affectedRows;
};

export const bulkMarkNotificationsRead = async (ids = [], isRead = true) => {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  await ensureNotificationsTable();

  const numericIds = ids.filter((id) => !isNaN(Number(id))).map(Number);
  const codeIds = ids.map(String);

  const [result] = await pool.query(
    "UPDATE notifications SET is_read = ? WHERE id IN (?) OR notification_code IN (?)",
    [isRead ? 1 : 0, numericIds.length > 0 ? numericIds : [-1], codeIds.length > 0 ? codeIds : ["__none__"]]
  );
  return result.affectedRows;
};
