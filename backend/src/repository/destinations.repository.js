import pool from "../db/db.js";

export const createDestinations = async (details) => {
  const { title, description, image, country, state, price, days } = details;

  const [result] = await pool.query(
    "INSERT INTO destinations(title, description, image, country, state, price, days) value(?,?,?,?,?,?,?)",
    [title, description, image, country, state, price, days],
  );
};
