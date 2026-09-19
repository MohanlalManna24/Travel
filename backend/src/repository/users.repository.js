import pool from "../db/db.js";
import bcrypt from "bcrypt";

// Auto ensure refresh_token column exists
export const ensureRefreshTokenColumn = async () => {
  try {
    const [cols] = await pool.query(
      "SHOW COLUMNS FROM users LIKE 'refresh_token'"
    );
    if (cols.length === 0) {
      await pool.query("ALTER TABLE users ADD COLUMN refresh_token TEXT NULL");
    }
  } catch (err) {
    // If table doesn't exist yet, it's fine
  }
};

ensureRefreshTokenColumn();

// 1. Get all users
export const getAllUsers = async () => {
  const [rows] = await pool.query(
    "SELECT id, fullname, email, phone, status, created_at, updated_at FROM users ORDER BY id ASC",
  );
  return rows;
};

// 2. Get user by id
export const getUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, fullname, email, phone, status, created_at, updated_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
};

// 3. Get user by email with hashed password for auth
export const getUserByEmailWithPassword = async (email) => {
  await ensureRefreshTokenColumn();
  const [rows] = await pool.query(
    "SELECT id, fullname, email, phone, password, status, refresh_token, created_at, updated_at FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
};

// 4. Update user refresh token in DB
export const updateUserRefreshToken = async (id, refreshToken) => {
  await ensureRefreshTokenColumn();
  await pool.query(
    "UPDATE users SET refresh_token = ? WHERE id = ?",
    [refreshToken, id]
  );
  return true;
};

// 5. Get user by refresh token
export const getUserByRefreshToken = async (refreshToken) => {
  await ensureRefreshTokenColumn();
  const [rows] = await pool.query(
    "SELECT id, fullname, email, phone, status, created_at, updated_at FROM users WHERE refresh_token = ? LIMIT 1",
    [refreshToken]
  );
  return rows[0] || null;
};

// 6. Clear user refresh token (logout)
export const clearUserRefreshToken = async (id) => {
  await ensureRefreshTokenColumn();
  await pool.query(
    "UPDATE users SET refresh_token = NULL WHERE id = ?",
    [id]
  );
  return true;
};

// 7. Create user
export const createUser = async (user) => {
  await ensureRefreshTokenColumn();
  const { fullname, email, phone, password, status = "active" } = user;
  const hashedPassword = password ? await bcrypt.hash(password, 10) : "";
  const [result] = await pool.query(
    "INSERT INTO users (fullname, email, phone, password, status) VALUES (?, ?, ?, ?, ?)",
    [fullname, email, phone, hashedPassword, (status || "active").toLowerCase()],
  );
  return { id: result.insertId, fullname, email, phone, status: status || "active" };
};

// 8. Check if user already exists
export const checkUserExist = async (email, excludeId = null) => {
  if (excludeId) {
    const [rows] = await pool.query(
      "SELECT id, email FROM users WHERE email = ? AND id != ?",
      [email, excludeId]
    );
    return rows.length > 0;
  }
  const [rows] = await pool.query(
    "SELECT id, email FROM users WHERE email = ?",
    [email]
  );
  return rows.length > 0;
};

// 9. Update user by id
export const updateUserById = async (id, user) => {
  await ensureRefreshTokenColumn();
  const { fullname, email, phone, password, status } = user;
  const existingUser = await getUserById(id);
  if (!existingUser) {
    return null;
  }

  const updatedFullname = fullname !== undefined ? fullname : existingUser.fullname;
  const updatedEmail = email !== undefined ? email : existingUser.email;
  const updatedPhone = phone !== undefined ? phone : existingUser.phone;
  const updatedStatus = status !== undefined ? status.toLowerCase() : existingUser.status;

  if (password && password.trim().length >= 6) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "UPDATE users SET fullname = ?, email = ?, phone = ?, password = ?, status = ? WHERE id = ?",
      [updatedFullname, updatedEmail, updatedPhone, hashedPassword, updatedStatus, id]
    );
  } else {
    await pool.query(
      "UPDATE users SET fullname = ?, email = ?, phone = ?, status = ? WHERE id = ?",
      [updatedFullname, updatedEmail, updatedPhone, updatedStatus, id]
    );
  }

  return await getUserById(id);
};

// 10. Delete user by id
export const deleteUserById = async (id) => {
  try {
    await pool.query("DELETE FROM users_full_details WHERE user_id = ?", [id]);
  } catch (err) {
    // Ignore if table/rows don't exist
  }

  const [result] = await pool.query(
    "DELETE FROM users WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};

// 11. Delete all users
export const deleteAllUsers = async () => {
  try {
    await pool.query("DELETE FROM users_full_details");
  } catch (err) {
    // Ignore
  }
  const [result] = await pool.query("DELETE FROM users");
  return result.affectedRows > 0;
};