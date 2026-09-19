import express from "express";
import {
  createNewBooking,
  fetchAllBookings,
  fetchBookingById,
  updateBookingById,
  deleteBookingById,
} from "../controllers/bookings.controllers.js";
import {
  bookingsValidation,
  bookingsUpdateValidation,
} from "../middleware/bookingsValidation.js";

const router = express.Router();

/**
 * @route POST /api/bookings/create or POST /api/bookings
 * @desc Create a new booking
 */
router.post("/create", bookingsValidation, createNewBooking);
router.post("/", bookingsValidation, createNewBooking);

/**
 * @route GET /api/bookings
 * @desc Get all bookings
 */
router.get("/", fetchAllBookings);

/**
 * @route GET /api/bookings/:id
 * @desc Get single booking by ID or reference
 */
router.get("/:id", fetchBookingById);

/**
 * @route PUT /api/bookings/update/:id or PUT /api/bookings/:id
 * @desc Update a booking by ID or reference
 */
router.put("/update/:id", bookingsUpdateValidation, updateBookingById);
router.put("/:id", bookingsUpdateValidation, updateBookingById);

/**
 * @route DELETE /api/bookings/delete/:id or DELETE /api/bookings/:id
 * @desc Delete a booking by ID or reference
 */
router.delete("/delete/:id", deleteBookingById);
router.delete("/:id", deleteBookingById);

export default router;
