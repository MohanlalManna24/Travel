import express from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUserProfile,
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  deleteAllUsers,
} from "../controllers/user.controllers.js";
import {
  registerValidation,
  loginValidation,
  userValidation,
  userUpdateValidation,
} from "../middleware/userValidation.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// ============================================================================
// AUTHENTICATION ROUTES (JWT & Cookies)
// ============================================================================

/*
 * @desc    Register a new user account & set cookies
 * @route   POST /api/users/register or /api/users/signup
 */
router.post("/register", registerValidation, registerUser);
router.post("/signup", registerValidation, registerUser);

/*
 * @desc    Sign in user & set HTTP-only Access & Refresh cookies
 * @route   POST /api/users/login or /api/users/signin
 */
router.post("/login", loginValidation, loginUser);
router.post("/signin", loginValidation, loginUser);

/*
 * @desc    Refresh expired Access Token via Refresh Token Cookie
 * @route   POST /api/users/refresh-token
 */
router.post("/refresh-token", refreshAccessToken);

/*
 * @desc    Log out user & clear HTTP-only Cookies
 * @route   POST /api/users/logout
 */
router.post("/logout", logoutUser);

/*
 * @desc    Get currently authenticated user profile
 * @route   GET /api/users/me or /api/users/profile
 */
router.get("/me", authenticateUser, getCurrentUserProfile);
router.get("/profile", authenticateUser, getCurrentUserProfile);

// ============================================================================
// USER MANAGEMENT CRUD ROUTES
// ============================================================================

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
 * @desc    Create a new user (Admin)
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