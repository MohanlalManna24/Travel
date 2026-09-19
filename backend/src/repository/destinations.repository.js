import pool from "../db/db.js";

export const createDestinations = async (details) => {
  const { title, description, image, country, state, price, days } = details;

  const [result] = await pool.query(
    "INSERT INTO destinations(title, description, image, country, state, price, days) value(?,?,?,?,?,?,?)",
    [title, description, image, country, state, price, days],
  );
};

export const getAllDestinations = async () => {
  const [rows] = await pool.query("SELECT * FROM destinations");
  return rows;
};

export const updateDestinations = async (id, details) => {
  const { title, description, image, country, state, price, days } = details;
  const [result] = await pool.query(
    "UPDATE destinations SET title = ?, description = ?, image = ?, country = ?, state = ?, price = ?, days = ? WHERE id = ?",
    [title, description, image, country, state, price, days, id],
  );
  return result;
};

export const deleteDestinations = async (id) => {
  const [result] = await pool.query("DELETE FROM destinations WHERE id = ?", [
    id,
  ]);
  return result;
};

export const checkDestinationsExists = async (id) => {
  const [rows] = await pool.query("SELECT * FROM destinations WHERE id = ?", [
    id,
  ]);
  return rows.length > 0;
};
