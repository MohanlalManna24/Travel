import { validationResult } from "express-validator";
import {
  createDestinations,
  getAllDestinations as allDestinations,
  updateDestinations,
  deleteDestinations,
  checkDestinationsExists,
  getDestinationById,
} from "../repository/destinations.repository.js";

export const createNewDestinations = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const created = await createDestinations(req.body);
    res.status(201).json({
      message: "Destination created successfully",
      destination: created,
      data: created,
    });
  } catch (error) {
    console.error("Error creating destination:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getAllDestinations = async (req, res) => {
  try {
    const destinations = await allDestinations();
    res.status(200).json(destinations || []);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getSingleDestination = async (req, res) => {
  const { id } = req.params;
  try {
    const destination = await getDestinationById(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.status(200).json(destination);
  } catch (error) {
    console.error("Error fetching destination by id:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateDestinationsById = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const destinationExists = await checkDestinationsExists(id);
    if (!destinationExists) {
      return res.status(404).json({ message: "Destination not found" });
    }

    const updatedDestinations = await updateDestinations(id, req.body);
    res.status(200).json({
      message: "Destination updated successfully",
      destination: updatedDestinations,
      data: updatedDestinations,
    });
  } catch (error) {
    console.error("Error updating destination:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteDestinationsById = async (req, res) => {
  const { id } = req.params;
  try {
    const destinationExists = await checkDestinationsExists(id);
    if (!destinationExists) {
      return res.status(404).json({ message: "Destination not found" });
    }
    await deleteDestinations(id);
    res.status(200).json({ message: "Destination deleted successfully", id });
  } catch (error) {
    console.error("Error deleting destination:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

