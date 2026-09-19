import { validationResult } from "express-validator";
import {
  getAllNotifications,
  getNotificationByIdOrCode,
  createNotification,
  updateNotification,
  setNotificationReadStatus,
  markAllNotificationsRead,
  saveNotificationReply,
  deleteNotification,
  bulkDeleteNotifications,
  bulkMarkNotificationsRead,
} from "../repository/notifications.repository.js";

export const fetchAllNotifications = async (req, res) => {
  try {
    const notifications = await getAllNotifications();
    res.status(200).json(notifications || []);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const fetchNotificationById = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await getNotificationByIdOrCode(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error("Error fetching notification details:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const createNewNotification = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const created = await createNotification(req.body);
    res.status(201).json({
      message: "Notification created successfully",
      notification: created,
      data: created,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateNotificationById = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updated = await updateNotification(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({
      message: "Notification updated successfully",
      notification: updated,
      data: updated,
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const toggleNotificationRead = async (req, res) => {
  const { id } = req.params;
  const { isRead } = req.body;
  try {
    const updated = await setNotificationReadStatus(id, isRead !== undefined ? isRead : true);
    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({
      message: `Notification marked as ${updated.isRead ? "read" : "unread"}`,
      notification: updated,
      data: updated,
    });
  } catch (error) {
    console.error("Error updating notification read status:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await markAllNotificationsRead();
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const replyToNotification = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updated = await saveNotificationReply(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({
      message: "Feedback reply dispatched successfully and marked resolved",
      notification: updated,
      data: updated,
    });
  } catch (error) {
    console.error("Error sending notification reply:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteNotificationById = async (req, res) => {
  const { id } = req.params;
  try {
    const success = await deleteNotification(id);
    if (!success) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted successfully", id });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const handleBulkActions = async (req, res) => {
  const { action, ids } = req.body;
  if (!action || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Invalid bulk action request" });
  }

  try {
    if (action === "delete") {
      const affected = await bulkDeleteNotifications(ids);
      return res.status(200).json({ message: `${affected} notifications deleted successfully` });
    } else if (action === "markRead") {
      const affected = await bulkMarkNotificationsRead(ids, true);
      return res.status(200).json({ message: `${affected} notifications marked as read` });
    } else if (action === "markUnread") {
      const affected = await bulkMarkNotificationsRead(ids, false);
      return res.status(200).json({ message: `${affected} notifications marked as unread` });
    } else {
      return res.status(400).json({ message: "Unsupported action" });
    }
  } catch (error) {
    console.error("Error performing bulk action:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
