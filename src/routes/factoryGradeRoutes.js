import express from "express";
import {
  getAllProcessedGrades,
  getAllProcessedGradesById,
} from "../controllers/factoryGradeControllers.js";
//import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Get all crop receptions
//router.get("/", requireAuth, getAllFactory);
router.get("/", getAllProcessedGrades);

// Get a single crop reception by ID
router.get("/:id", getAllProcessedGradesById);

/* // Create a new crop reception
router.post("/", createReception);

// Update a crop reception
router.put("/:id", updateReception);

// Delete a crop reception
router.delete("/:id", deleteReception); */

export default router;
