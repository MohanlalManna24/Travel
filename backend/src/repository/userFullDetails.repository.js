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
  const [rows] = await pool.query(`
    SELECT 
      u.id AS id,
      u.id AS user_id,
      u.fullname,
      u.fullname AS name,
      u.email,
      u.phone,
      u.status,
      u.created_at,
      u.updated_at,
      ufd.id AS details_id,
      ufd.profile_img,
      ufd.profile_img AS avatar,
      ufd.DOB,
      ufd.gender,
      ufd.address_line1,
      ufd.address_line2,
      ufd.city,
      ufd.state,
      ufd.pin_code,
      ufd.country,
      ufd.nationality,
      ufd.passport_number,
      ufd.preferred_airport,
      ufd.preferred_seat,
      ufd.dietary_preferences,
      ufd.medical_notes,
      ufd.Emergency_contact_name,
      ufd.Emergency_contact_number,
      ufd.Emergency_contact_relationship
    FROM users AS u
    LEFT JOIN users_full_details AS ufd ON u.id = ufd.user_id
    ORDER BY u.id ASC
  `);
  return rows;
};

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

  const exists = await checkUserFullDetailsExists(userId);
  if (!exists) {
    return await createUserFullDetails({
      userId,
      profileImg: profileImg || null,
      DOB: DOB || "2000-01-01",
      gender: gender || "Other",
      address_line1: address_line1 || "Not specified",
      address_line2: address_line2 || null,
      city: city || "Not specified",
      state: state || "Not specified",
      pin_code: pin_code || "000000",
      country: country || "India",
      nationality: nationality || "Indian",
      passport_number: passport_number || "N/A",
      preferred_airport: preferred_airport || null,
      preferred_seat: preferred_seat || null,
      dietary_preferences: dietary_preferences || null,
      medical_notes: medical_notes || null,
      Emergency_contact_name: Emergency_contact_name || null,
      Emergency_contact_number: Emergency_contact_number || null,
      Emergency_contact_relationship: Emergency_contact_relationship || null,
    });
  }

  const [result] = await pool.query(
    `UPDATE users_full_details SET
      profile_img = COALESCE(?, profile_img),
      DOB = COALESCE(?, DOB),
      gender = COALESCE(?, gender),
      address_line1 = COALESCE(?, address_line1),
      address_line2 = COALESCE(?, address_line2),
      city = COALESCE(?, city),
      state = COALESCE(?, state),
      pin_code = COALESCE(?, pin_code),
      country = COALESCE(?, country),
      nationality = COALESCE(?, nationality),
      passport_number = COALESCE(?, passport_number),
      preferred_airport = COALESCE(?, preferred_airport),
      preferred_seat = COALESCE(?, preferred_seat),
      dietary_preferences = COALESCE(?, dietary_preferences),
      medical_notes = COALESCE(?, medical_notes),
      Emergency_contact_name = COALESCE(?, Emergency_contact_name),
      Emergency_contact_number = COALESCE(?, Emergency_contact_number),
      Emergency_contact_relationship = COALESCE(?, Emergency_contact_relationship)
    WHERE user_id = ?`,
    [
      profileImg || null,
      DOB || null,
      gender || null,
      address_line1 || null,
      address_line2 || null,
      city || null,
      state || null,
      pin_code || null,
      country || null,
      nationality || null,
      passport_number || null,
      preferred_airport || null,
      preferred_seat || null,
      dietary_preferences || null,
      medical_notes || null,
      Emergency_contact_name || null,
      Emergency_contact_number || null,
      Emergency_contact_relationship || null,
      userId,
    ]
  );
  return result;
};

export const deleteUserFullDetailsByUserId = async (userId) => {
  const [result] = await pool.query(
    "DELETE FROM users_full_details WHERE user_id = ?",
    [userId]
  );
  return result.affectedRows > 0;
};