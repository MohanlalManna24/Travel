import pool from "../db/db.js";

export const createDestinations = async (details) => {
  const {
    title,
    name,
    description = "",
    image,
    country = "India",
    state = "",
    location = "",
    price,
    pricePerHead,
    days = 1,
    status = "active",
  } = details;

  const destinationTitle = title || name || "Untitled Destination";
  const destinationPrice = Number(price ?? pricePerHead ?? 0);
  const destinationDays = Number(days || 1);

  let finalCountry = country;
  let finalState = state;
  if (location && (!state || !country)) {
    const parts = location.split(",").map((s) => s.trim());
    if (parts.length > 1) {
      finalState = parts[0];
      finalCountry = parts.slice(1).join(", ");
    } else if (parts.length === 1) {
      finalState = parts[0];
    }
  }

  const [result] = await pool.query(
    "INSERT INTO destinations(title, description, image, country, state, price, days, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      destinationTitle,
      description,
      image,
      finalCountry || "India",
      finalState || "",
      destinationPrice,
      destinationDays,
      (status || "active").toLowerCase(),
    ],
  );

  return {
    id: result.insertId,
    title: destinationTitle,
    name: destinationTitle,
    description,
    image,
    country: finalCountry,
    state: finalState,
    location: [finalState, finalCountry].filter(Boolean).join(", "),
    price: destinationPrice,
    pricePerHead: destinationPrice,
    days: destinationDays,
    status: status || "active",
  };
};

export const getAllDestinations = async () => {
  const [rows] = await pool.query(`
    SELECT 
      id,
      title,
      title AS name,
      description,
      image,
      country,
      state,
      COALESCE(NULLIF(CONCAT_WS(', ', state, country), ''), 'India') AS location,
      status,
      price,
      price AS pricePerHead,
      days,
      created_at,
      updated_at
    FROM destinations
    ORDER BY id DESC
  `);
  return rows;
};

export const getDestinationById = async (id) => {
  const [rows] = await pool.query(
    `SELECT 
      id,
      title,
      title AS name,
      description,
      image,
      country,
      state,
      COALESCE(NULLIF(CONCAT_WS(', ', state, country), ''), 'India') AS location,
      status,
      price,
      price AS pricePerHead,
      days,
      created_at,
      updated_at
    FROM destinations WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

export const updateDestinations = async (id, details) => {
  const {
    title,
    name,
    description,
    image,
    country,
    state,
    location,
    price,
    pricePerHead,
    days,
    status,
  } = details;

  const existing = await getDestinationById(id);
  if (!existing) return null;

  const destinationTitle = title !== undefined ? title : (name !== undefined ? name : existing.title);
  const destinationDesc = description !== undefined ? description : existing.description;
  const destinationImage = image !== undefined ? image : existing.image;
  const destinationPrice = price !== undefined ? Number(price) : (pricePerHead !== undefined ? Number(pricePerHead) : existing.price);
  const destinationDays = days !== undefined ? Number(days) : existing.days;
  const destinationStatus = status !== undefined ? status.toLowerCase() : existing.status;

  let finalCountry = country !== undefined ? country : existing.country;
  let finalState = state !== undefined ? state : existing.state;

  if (location !== undefined) {
    const parts = location.split(",").map((s) => s.trim());
    if (parts.length > 1) {
      finalState = parts[0];
      finalCountry = parts.slice(1).join(", ");
    } else if (parts.length === 1) {
      finalState = parts[0];
    }
  }

  await pool.query(
    `UPDATE destinations SET
      title = ?,
      description = ?,
      image = ?,
      country = ?,
      state = ?,
      price = ?,
      days = ?,
      status = ?
    WHERE id = ?`,
    [
      destinationTitle,
      destinationDesc,
      destinationImage,
      finalCountry,
      finalState,
      destinationPrice,
      destinationDays,
      destinationStatus,
      id,
    ],
  );

  return await getDestinationById(id);
};

export const deleteDestinations = async (id) => {
  const [result] = await pool.query("DELETE FROM destinations WHERE id = ?", [
    id,
  ]);
  return result.affectedRows > 0;
};

export const checkDestinationsExists = async (id) => {
  const [rows] = await pool.query("SELECT id FROM destinations WHERE id = ?", [
    id,
  ]);
  return rows.length > 0;
};

