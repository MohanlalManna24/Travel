import pool from "../db/db.js";

//get all users

export const getAllUsers = async () => {
  const [rows] = await pool.query("SELECT id, fullname, email, phone FROM USERS ORDER BY id ASC");
  return rows;
};
