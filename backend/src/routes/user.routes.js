import express from "express";
import { getAllUsers,getUserById, createUser } from "../controllers/user.controllers.js";

const router = express.Router();

/*
 * @desc    Get all users
 * @route   GET /api/users/
 */
router.get("/", getAllUsers);

/*
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 */
router.get("/:id", getUserById);

/*
 * @desc    Create a new user
 * @route   POST /api/users/createuser
 */
router.post("/createuser", createUser);



export default router;