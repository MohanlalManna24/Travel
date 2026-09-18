import { validationResult } from "express-validator";
import { createDestinations } from "../repository/destinations.repository.js";

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
