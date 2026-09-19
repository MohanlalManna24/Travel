import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  deleteAllUsers,
} from "../controllers/user.controllers.js";
import { userValidation, userUpdateValidation } from "../middleware/userValidation.js";

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
 * @route   POST /api/users/createuser or POST /api/users/
 */
router.post("/createuser", userValidation, createUser);
router.post("/", userValidation, createUser);

/*
 * @desc    Update user by ID
 * @route   PUT /api/users/updateuser/:id or PUT /api/users/:id
 */
router.put("/updateuser/:id", userUpdateValidation, updateUserById);
router.put("/:id", userUpdateValidation, updateUserById);

/*
 * @desc    Delete user by ID
 * @route   DELETE /api/users/deleteuser/:id or DELETE /api/users/:id
 */
router.delete("/deleteuser/:id", deleteUserById);
router.delete("/:id", deleteUserById);

/*
 * @desc    Delete all users
 * @route   DELETE /api/users/deleteall
 */
router.delete("/deleteall", deleteAllUsers);

export default router;