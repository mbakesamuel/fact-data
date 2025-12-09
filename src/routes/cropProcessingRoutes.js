import express from "express";
import {
  createProcessing,
  deleteProcessing,
  getAllProcessing,
  getProcessingById,
  updateProcessing,
} from "../controllers/processingControllers.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Get all crop processings
router.get("/", requireAuth, getAllProcessing);

// Get a single crop processing by ID
router.get("/:id", requireAuth, getProcessingById);

// Create a new crop processing
router.post("/", requireAuth, createProcessing);

// Update a crop processing
router.put("/:id", requireAuth, updateProcessing);

// Delete a crop processing
router.delete("/:id", requireAuth, deleteProcessing);

export default router;
