import express from "express";
import { getAllUsers } from "../controllers/user.controllers.js";

const router = express.Router();

/*
 * @desc    Get all users
 * @route   GET /api/auth/
 */
router.get("/", getAllUsers);



export default router;