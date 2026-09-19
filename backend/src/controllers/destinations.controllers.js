import { validationResult } from "express-validator";
import {
  createDestinations,
  getAllDestinations as allDestinations,
  updateDestinations,
  deleteDestinations,
  checkDestinationsExists,
} from "../repository/destinations.repository.js";

export const createNewDestinations = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await createDestinations(req.body);
    res.status(201).json({ message: "Destinations created successfully" });
  } catch (error) {
    console.error("Error creating Destinations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllDestinations = async (req, res) => {
  try {
    const destinations = await allDestinations();
    res.status(200).json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateDestinationsById = async (req, res) => {
  const { id } = req.params;
  const destinationExists = await checkDestinationsExists(id);
  if (!destinationExists) {
    return res.status(404).json({ message: "Destination not found" });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const updatedDestinations = await updateDestinations(id, req.body);
    res
      .status(200)
      .json({
        message: "Destinations updated successfully",
        data: updatedDestinations,
      });
  } catch (error) {
    console.error("Error updating destinations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteDestinationsById = async (req, res) => {
  try {
    const { id } = req.params;
    const destinationExists = await checkDestinationsExists(id);
    if (!destinationExists) {
      return res.status(404).json({ message: "Destination not found" });
    }
    await deleteDestinations(id);
    res.status(200).json({ message: "Destinations deleted successfully" });
  } catch (error) {
    console.error("Error deleting destinations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
