import express from "express";
import { createNewDestinations, getAllDestinations, updateDestinationsById, deleteDestinationsById } from "../controllers/destinations.controllers.js";
import destinationsValidation from "../middleware/destinationsValidation.js";

const router = express.Router();

/**
 * @route POST /api/destinations/create
 * @desc Create a new destination
 */
router.post("/create", destinationsValidation, createNewDestinations);

/**
 * @route GET /api/destinations
 * @desc Get all destinations
 */
router.get("/", getAllDestinations);

/**
 * @route PUT /api/destinations/update/:id
 * @desc Update a destination by ID
 */
router.put("/update/:id", destinationsValidation, updateDestinationsById);

/**
 * @route DELETE /api/destinations/delete/:id
 * @desc Delete a destination by ID
 */
router.delete("/delete/:id", deleteDestinationsById);

export default router;
