import express from "express";
import {
  createUserFullDetails,
  getUserFullDetailsById,
  getAllUserFullDetails,
  updateUserFullDetails,
} from "../controllers/userFullDetails.controllers.js";
import userFullDetailsValidation from "../middleware/userFullDetailsValidation.js";
const router = express.Router();

/**
 * @desc    Create user full details
 * @route   POST /api/user-details/create
 */
router.post("/create", userFullDetailsValidation, createUserFullDetails);

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
 * @route   PUT /api/user-details/update/:userId
 */

router.put("/update/:userId", userFullDetailsValidation, updateUserFullDetails);

export default router;
