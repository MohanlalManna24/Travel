import { getUserById } from "../repository/users.repository.js";
import {
  createUserFullDetails as createUserFullDetailsRepository,
  getUserFullDetailsByUserId,
  getAllUserFullDetails as getUserFullDetails,
  updateUserFullDetails as updateUserDetails,
  deleteUserFullDetailsByUserId,
  checkUserFullDetailsExists,
} from "../repository/userFullDetails.repository.js";
import { validationResult } from "express-validator";

// Implementation for creating a user address
export const createUserFullDetails = async (req, res) => {
  const userExists = await checkUserFullDetailsExists(req.body.userId);
  if (userExists) {
    return res.status(400).json({ message: "User full details already exist" });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await getUserById(req.body.userId);
    if (!user) {
      return res.status(404).json({
        message: `User with ID ${req.body.userId} does not exist`,
      });
    }

    await createUserFullDetailsRepository(req.body);
    res.status(201).json({ message: "User address created successfully" });
  } catch (error) {
    console.error("Error creating user address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserFullDetailsById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userFullDetails = await getUserFullDetailsByUserId(userId);
    if (!userFullDetails) {
      return res.status(404).json({ message: "User full details not found" });
    }
    res.status(200).json({ userFullDetails });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUserFullDetails = async (req, res) => {
  try {
    const userFullDetails = await getUserFullDetails();
    res.status(200).json({ userFullDetails });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserFullDetails = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const userId = req.params.userId;
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await updateUserDetails(userId, req.body);
    res.status(200).json({ message: "User full details updated successfully" });
  } catch (error) {
    console.error("Error updating user full details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUserFullDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    const deleted = await deleteUserFullDetailsByUserId(userId);
    if (!deleted) {
      return res.status(404).json({ message: "User full details not found" });
    }
    res.status(200).json({ message: "User full details deleted successfully", userId });
  } catch (error) {
    console.error("Error deleting user full details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

