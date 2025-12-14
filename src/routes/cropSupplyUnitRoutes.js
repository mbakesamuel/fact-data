import express from "express";
import {
  getAllCropSupplyUnit,
  getCropSupplyUnitById,
} from "../controllers/cropSupplyUnitController.js";


const router = express.Router();

// Get all crop receptions
//router.get("/", requireAuth, getAllFactory);
router.get("/", getAllCropSupplyUnit);

// Get a single crop reception by ID
router.get("/:id", getCropSupplyUnitById);

/* // Create a new crop reception
router.post("/", createReception);

// Update a crop reception
router.put("/:id", updateReception);

// Delete a crop reception
router.delete("/:id", deleteReception); */

export default router;
