import express from "express";
import {
  createReception,
  deleteReception,
  getAllReception,
  getReceptionById,
  updateReception,
} from "../controllers/receptionControllers.js";
import { requireAuth } from "@clerk/express";

const router = express.Router();

// Get all crop receptions
router.get("/", requireAuth, getAllReception);

// Get a single crop reception by ID
router.get("/:id", requireAuth, getReceptionById);

// Create a new crop reception
router.post("/", requireAuth, createReception);

// Update a crop reception
router.put("/:id", requireAuth, updateReception);

// Delete a crop reception
router.delete("/:id", requireAuth, deleteReception);

export default router;
