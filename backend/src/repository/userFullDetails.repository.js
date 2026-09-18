import pool from "../db/db.js";

export const createUserFullDetails = async (details) => {
  const {
    userId,
    profileImg,
    DOB,
    gender,
    address_line1,
    address_line2,
    city,
    state,
    pin_code,
    country,
    nationality,
    passport_number,
    preferred_airport,
    preferred_seat,
    dietary_preferences,
    medical_notes,
    Emergency_contact_name,
    Emergency_contact_number,
    Emergency_contact_relationship,
  } = details;

  const [result] = await pool.query(
    `INSERT INTO users_full_details (
      user_id,
      profile_img,
      DOB,
      gender,
      address_line1,
      address_line2,
      city,
      state,
      pin_code,
      country,
      nationality,
      passport_number,
      preferred_airport,
      preferred_seat,
      dietary_preferences,
      medical_notes,
      Emergency_contact_name,
      Emergency_contact_number,
      Emergency_contact_relationship
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      profileImg,
      DOB,
      gender,
      address_line1,
      address_line2,
      city,
      state,
      pin_code,
      country,
      nationality,
      passport_number,
      preferred_airport,
      preferred_seat,
      dietary_preferences,
      medical_notes,
      Emergency_contact_name,
      Emergency_contact_number,
      Emergency_contact_relationship,
    ],
  );
  return result;
};

export const checkUserFullDetailsExists = async (userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM users_full_details WHERE user_id = ?",
    [userId]
  );
  return rows.length > 0;
};

export const getUserFullDetailsByUserId = async (userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM users_full_details WHERE user_id = ?",
    [userId]
  );
  return rows[0];
};

export const getAllUserFullDetails = async () => {
  const [rows] = await pool.query("SELECT * FROM users_full_details");
  return rows;
}

export const updateUserFullDetails = async (userId, details) => {
  const {
    profileImg,
    DOB,
    gender,
    address_line1,
    address_line2,
    city,
    state,
    pin_code,
    country,
    nationality,
    passport_number,
    preferred_airport,
    preferred_seat,
    dietary_preferences,
    medical_notes,
    Emergency_contact_name,
    Emergency_contact_number,
    Emergency_contact_relationship,
  } = details;

  const [result] = await pool.query(
    `UPDATE users_full_details SET
      profile_img = ?,
      DOB = ?,
      gender = ?,
      address_line1 = ?,
      address_line2 = ?,
      city = ?,
      state = ?,
      pin_code = ?,
      country = ?,
      nationality = ?,
      passport_number = ?,
      preferred_airport = ?,
      preferred_seat = ?,
      dietary_preferences = ?,
      medical_notes = ?,
      Emergency_contact_name = ?,
      Emergency_contact_number = ?,
      Emergency_contact_relationship = ?
    WHERE user_id = ?`,
    [
      profileImg,
      DOB,
      gender,
      address_line1,
      address_line2,
      city,
      state,
      pin_code,
      country,
      nationality,
      passport_number,
      preferred_airport,
      preferred_seat,
      dietary_preferences,
      medical_notes,
      Emergency_contact_name,
      Emergency_contact_number,
      Emergency_contact_relationship,
      userId,
    ]
  );
  return result;
};