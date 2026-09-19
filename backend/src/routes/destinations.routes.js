import express from "express";
import {
  createNewDestinations,
  getAllDestinations,
  getSingleDestination,
  updateDestinationsById,
  deleteDestinationsById,
} from "../controllers/destinations.controllers.js";
import {
  destinationsValidation,
  destinationsUpdateValidation,
} from "../middleware/destinationsValidation.js";

const router = express.Router();

/**
 * @route POST /api/destinations/create or POST /api/destinations
 * @desc Create a new destination
 */
router.post("/create", destinationsValidation, createNewDestinations);
router.post("/", destinationsValidation, createNewDestinations);

/**
 * @route GET /api/destinations
 * @desc Get all destinations
 */
router.get("/", getAllDestinations);

/**
 * @route GET /api/destinations/:id
 * @desc Get single destination by ID
 */
router.get("/:id", getSingleDestination);

/**
 * @route PUT /api/destinations/update/:id or PUT /api/destinations/:id
 * @desc Update a destination by ID
 */
router.put("/update/:id", destinationsUpdateValidation, updateDestinationsById);
router.put("/:id", destinationsUpdateValidation, updateDestinationsById);

/**
 * @route DELETE /api/destinations/delete/:id or DELETE /api/destinations/:id
 * @desc Delete a destination by ID
 */
router.delete("/delete/:id", deleteDestinationsById);
router.delete("/:id", deleteDestinationsById);

export default router;

