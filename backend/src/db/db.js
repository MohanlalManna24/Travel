import "dotenv/config";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),

  waitForConnections: true,
  connectionLimit: 10,
});

try {
  await pool.query("SELECT 1");
  console.log("Database connection successful");
} catch (error) {
  console.error("Database connection failed:", error.message);
  throw error;
}

export default pool;
