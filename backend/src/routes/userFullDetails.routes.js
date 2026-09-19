import express from "express";
import {
  createUserFullDetails,
  getUserFullDetailsById,
  getAllUserFullDetails,
  updateUserFullDetails,
  deleteUserFullDetails,
} from "../controllers/userFullDetails.controllers.js";
import userFullDetailsValidation from "../middleware/userFullDetailsValidation.js";

const router = express.Router();

/**
 * @desc    Create user full details
 * @route   POST /api/user-details/create or POST /api/user-details/
 */
router.post("/create", userFullDetailsValidation, createUserFullDetails);
router.post("/", userFullDetailsValidation, createUserFullDetails);

/**
 * @desc    Get user full details by user ID
 * @route   GET /api/user-details/:userId
 */
router.get("/:userId", getUserFullDetailsById);

/**
 * @desc    Get all user full details
 * @route   GET /api/user-details/
 */
router.get("/", getAllUserFullDetails);

/**
 * @desc    Update user full details by user ID
 * @route   PUT /api/user-details/update/:userId or PUT /api/user-details/:userId
 */
router.put("/update/:userId", userFullDetailsValidation, updateUserFullDetails);
router.put("/:userId", userFullDetailsValidation, updateUserFullDetails);

/**
 * @desc    Delete user full details by user ID
 * @route   DELETE /api/user-details/delete/:userId or DELETE /api/user-details/:userId
 */
router.delete("/delete/:userId", deleteUserFullDetails);
router.delete("/:userId", deleteUserFullDetails);

export default router;

