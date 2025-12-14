import express from "express";
import {
  getAllFieldSupply,
  getFieldSupplyById,
} from "../controllers/fieldSupplyControllers.js";
//import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Get all crop receptions
//router.get("/", requireAuth, getAllFactory);
router.get("/", getAllFieldSupply);

// Get a single crop reception by ID
router.get("/:id", getFieldSupplyById);

/* // Create a new crop reception
router.post("/", createReception);

// Update a crop reception
router.put("/:id", updateReception);

// Delete a crop reception
router.delete("/:id", deleteReception); */

export default router;
