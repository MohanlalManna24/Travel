import pool from "../db/db.js";

// Helper to reliably format MySQL Date or input date string to YYYY-MM-DD
export const formatDateToISO = (dateVal) => {
  if (!dateVal) return null;
  if (dateVal instanceof Date) {
    if (isNaN(dateVal.getTime())) return null;
    const year = dateVal.getFullYear();
    const month = String(dateVal.getMonth() + 1).padStart(2, "0");
    const day = String(dateVal.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const str = String(dateVal).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str.slice(0, 10);
  }
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return str.slice(0, 10);
};

// Helper to normalize and map DB rows to frontend-friendly nested structure
export const mapBookingRow = (row) => {
  if (!row) return null;
  return {
    id: row.booking_reference || `BKG-${row.id}`,
    db_id: row.id,
    bookingReference: row.booking_reference,
    userId: row.user_id,
    destinationId: row.destination_id,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone || "",
      avatar: row.customer_avatar || "",
      city: row.customer_city || "",
    },
    destination: {
      id: row.destination_id ? `destination-${row.destination_id}` : "custom-trip",
      name: row.destination_name,
      location: row.destination_location || "",
      image: row.destination_image || "",
    },
    startDate: formatDateToISO(row.start_date) || "",
    endDate: formatDateToISO(row.end_date) || "",
    guests: Number(row.guests || 1),
    totalAmount: Number(row.total_amount || 0),
    paymentStatus: row.payment_status || "Pending",
    paymentMethod: row.payment_method || "Credit Card",
    transactionId: row.transaction_id || `TXN-${row.id}`,
    bookingStatus: row.booking_status || "Pending",
    specialNotes: row.special_notes || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const createBooking = async (bookingData) => {
  const {
    bookingReference,
    userId = null,
    destinationId = null,
    customer = {},
    customerName,
    customerEmail,
    customerPhone,
    customerCity,
    customerAvatar,
    destination = {},
    destinationName,
    destinationLocation,
    destinationImage,
    startDate,
    endDate,
    guests = 1,
    totalAmount = 0,
    paymentStatus = "Pending",
    paymentMethod = "Credit Card",
    transactionId,
    bookingStatus = "Pending",
    specialNotes = "",
  } = bookingData;

  const ref =
    bookingReference ||
    `BKG-${Math.floor(10000 + Math.random() * 90000)}`;

  const name = customerName || customer.name || "Valued Traveler";
  const email = customerEmail || customer.email || "";
  const phone = customerPhone || customer.phone || "";
  const city = customerCity || customer.city || "";
  const avatar = customerAvatar || customer.avatar || "";

  const destName = destinationName || destination.name || "Custom Tour Package";
  const destLoc = destinationLocation || destination.location || "";
  const destImg = destinationImage || destination.image || "";

  const sDate = formatDateToISO(startDate) || formatDateToISO(new Date());
  const eDate = formatDateToISO(endDate) || formatDateToISO(new Date());

  const [result] = await pool.query(
    `INSERT INTO bookings (
      booking_reference,
      user_id,
      destination_id,
      customer_name,
      customer_email,
      customer_phone,
      customer_city,
      customer_avatar,
      destination_name,
      destination_location,
      destination_image,
      start_date,
      end_date,
      guests,
      total_amount,
      payment_status,
      payment_method,
      transaction_id,
      booking_status,
      special_notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ref,
      userId,
      destinationId,
      name,
      email,
      phone,
      city,
      avatar,
      destName,
      destLoc,
      destImg,
      sDate,
      eDate,
      Number(guests || 1),
      Number(totalAmount || 0),
      paymentStatus,
      paymentMethod,
      transactionId || `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      bookingStatus,
      specialNotes,
    ]
  );

  return await getBookingByIdOrRef(result.insertId);
};

export const getAllBookings = async () => {
  const [rows] = await pool.query("SELECT * FROM bookings ORDER BY created_at DESC");
  return rows.map(mapBookingRow);
};

export const getBookingByIdOrRef = async (idOrRef) => {
  if (!idOrRef) return null;

  let query = "SELECT * FROM bookings WHERE booking_reference = ? LIMIT 1";
  let params = [String(idOrRef)];

  if (!isNaN(Number(idOrRef)) && !String(idOrRef).startsWith("BKG-")) {
    query = "SELECT * FROM bookings WHERE id = ? OR booking_reference = ? LIMIT 1";
    params = [Number(idOrRef), String(idOrRef)];
  }

  const [rows] = await pool.query(query, params);
  return rows.length > 0 ? mapBookingRow(rows[0]) : null;
};

export const updateBooking = async (idOrRef, updateData) => {
  const existing = await getBookingByIdOrRef(idOrRef);
  if (!existing) return null;

  const {
    customer = {},
    customerName,
    customerEmail,
    customerPhone,
    customerCity,
    customerAvatar,
    destination = {},
    destinationName,
    destinationLocation,
    destinationImage,
    startDate,
    endDate,
    guests,
    totalAmount,
    paymentStatus,
    paymentMethod,
    transactionId,
    bookingStatus,
    specialNotes,
  } = updateData;

  const name = customerName !== undefined ? customerName : (customer.name !== undefined ? customer.name : existing.customer.name);
  const email = customerEmail !== undefined ? customerEmail : (customer.email !== undefined ? customer.email : existing.customer.email);
  const phone = customerPhone !== undefined ? customerPhone : (customer.phone !== undefined ? customer.phone : existing.customer.phone);
  const city = customerCity !== undefined ? customerCity : (customer.city !== undefined ? customer.city : existing.customer.city);
  const avatar = customerAvatar !== undefined ? customerAvatar : (customer.avatar !== undefined ? customer.avatar : existing.customer.avatar);

  const destName = destinationName !== undefined ? destinationName : (destination.name !== undefined ? destination.name : existing.destination.name);
  const destLoc = destinationLocation !== undefined ? destinationLocation : (destination.location !== undefined ? destination.location : existing.destination.location);
  const destImg = destinationImage !== undefined ? destinationImage : (destination.image !== undefined ? destination.image : existing.destination.image);

  const sDate = startDate ? formatDateToISO(startDate) : formatDateToISO(existing.startDate);
  const eDate = endDate ? formatDateToISO(endDate) : formatDateToISO(existing.endDate);
  const numGuests = guests !== undefined ? Number(guests) : existing.guests;
  const amount = totalAmount !== undefined ? Number(totalAmount) : existing.totalAmount;
  const payStatus = paymentStatus !== undefined ? paymentStatus : existing.paymentStatus;
  const payMethod = paymentMethod !== undefined ? paymentMethod : existing.paymentMethod;
  const txnId = transactionId !== undefined ? transactionId : existing.transactionId;
  const bkgStatus = bookingStatus !== undefined ? bookingStatus : existing.bookingStatus;
  const notes = specialNotes !== undefined ? specialNotes : existing.specialNotes;

  await pool.query(
    `UPDATE bookings SET
      customer_name = ?,
      customer_email = ?,
      customer_phone = ?,
      customer_city = ?,
      customer_avatar = ?,
      destination_name = ?,
      destination_location = ?,
      destination_image = ?,
      start_date = ?,
      end_date = ?,
      guests = ?,
      total_amount = ?,
      payment_status = ?,
      payment_method = ?,
      transaction_id = ?,
      booking_status = ?,
      special_notes = ?
    WHERE id = ?`,
    [
      name,
      email,
      phone,
      city,
      avatar,
      destName,
      destLoc,
      destImg,
      sDate,
      eDate,
      numGuests,
      amount,
      payStatus,
      payMethod,
      txnId,
      bkgStatus,
      notes,
      existing.db_id,
    ]
  );

  return await getBookingByIdOrRef(existing.db_id);
};

export const deleteBooking = async (idOrRef) => {
  if (!idOrRef) return false;

  let query = "DELETE FROM bookings WHERE booking_reference = ?";
  let params = [String(idOrRef)];

  if (!isNaN(Number(idOrRef)) && !String(idOrRef).startsWith("BKG-")) {
    query = "DELETE FROM bookings WHERE id = ? OR booking_reference = ?";
    params = [Number(idOrRef), String(idOrRef)];
  }

  const [result] = await pool.query(query, params);
  return result.affectedRows > 0;
};
