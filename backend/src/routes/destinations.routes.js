import express from "express";
import { createNewDestinations } from "../controllers/destinations.controllers.js";
import destinationsValidation from "../middleware/destinationsValidation.js";

const router = express.Router();

/*
 
 */

router.post("/create", destinationsValidation, createNewDestinations);

export default router;
