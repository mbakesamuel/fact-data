import express from "express";
import {
  createReception,
  deleteReception,
  getAllReception,
  getReceptionById,
  updateReception,
} from "../controllers/receptionControllers.js";
//import { requireAuth } from "@clerk/express";

const router = express.Router();

// Get all crop receptions
router.get("/", getAllReception);

// Get a single crop reception by ID
router.get("/:id", getReceptionById);

// Create a new crop reception
router.post("/", createReception);

// Update a crop reception
router.put("/:id", updateReception);

// Delete a crop reception
router.delete("/:id", deleteReception);

export default router;
