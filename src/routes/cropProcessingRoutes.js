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
router.get("/", getAllProcessing);

// Get a single crop processing by ID
router.get("/:id", getProcessingById);

// Create a new crop processing
router.post("/", createProcessing);

// Update a crop processing
router.put("/:id", updateProcessing);

// Delete a crop processing
router.delete("/:id", deleteProcessing);

export default router;
