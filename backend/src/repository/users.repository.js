import pool from "../db/db.js";
import bcrypt from "bcrypt";

//1. Get all users
export const getAllUsers = async () => {
  const [rows] = await pool.query(
    "SELECT id, fullname, email, phone FROM USERS ORDER BY id ASC",
  );
  return rows;
};

//2. Get user by id
export const getUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, fullname, email, phone FROM USERS where id = ?",[id]
  );
  return rows;
};

//3. Create users
export const createUser = async (user) => {
  const { fullname, email, phone, password } = user;
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO USERS(fullname, email, phone, password) VALUE(?,?,?,?)",
    [fullname, email, phone, hashedPassword],
  );
  return { id: result.insertId, fullname, email, phone };
};

//4. Check if user already exist
export const checkUserExist = async (email) => {
  const [rows] = await pool.query(
    "SELECT email FROM USERS WHERE email = ?",
    [email]
  );
  return rows.length > 0;
};