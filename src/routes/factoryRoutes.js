import express from "express";
import {
  getAllFactory,
  getFactoryById,
} from "../controllers/factoryControllers.js";

const router = express.Router();

// Get all crop receptions
router.get("/", getAllFactory);

// Get a single crop reception by ID
router.get("/:id", getFactoryById);

/* // Create a new crop reception
router.post("/", createReception);

// Update a crop reception
router.put("/:id", updateReception);

// Delete a crop reception
router.delete("/:id", deleteReception); */

export default router;
