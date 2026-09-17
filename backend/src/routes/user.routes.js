import express from "express";
import { getAllUsers,getUserById, createUser, updateUserById, deleteUserById,deleteAllUsers } from "../controllers/user.controllers.js";
import studentValidation from "../middleware/studentValidation.js";

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
router.post("/createuser", studentValidation, createUser);

/*
 * @desc    Update user by ID
 * @route   PUT /api/users/updateuser/:id
 */
router.put("/updateuser/:id", studentValidation, updateUserById);

/*
 * @desc    Delete user by ID
 * @route   DELETE /api/users/deleteuser/:id
 */
router.delete("/deleteuser/:id", deleteUserById);

/*
 * @desc    Delete all users
 * @route   DELETE /api/users/deleteall
 */
router.delete("/deleteall", deleteAllUsers);



export default router;