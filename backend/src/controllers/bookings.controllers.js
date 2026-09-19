import { validationResult } from "express-validator";
import {
  createBooking,
  getAllBookings,
  getBookingByIdOrRef,
  updateBooking,
  deleteBooking,
} from "../repository/bookings.repository.js";

export const createNewBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const booking = await createBooking(req.body);
    res.status(201).json({
      message: "Booking created successfully",
      booking,
      data: booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const fetchAllBookings = async (req, res) => {
  try {
    const bookings = await getAllBookings();
    res.status(200).json(bookings || []);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const fetchBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await getBookingByIdOrRef(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateBookingById = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updated = await updateBooking(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({
      message: "Booking updated successfully",
      booking: updated,
      data: updated,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await deleteBooking(id);
    if (!deleted) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully", id });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
