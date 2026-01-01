import express from "express";
import {
  deleteCropCollection,
  getAllCropCollection,
  getAllCropCollectionById,
} from "../controllers/cropCollectionControllers.js";

//import { requireAuth } from "@clerk/express";

const router = express.Router();

// Get all crop receptions
router.get("/", getAllCropCollection);

// Get a single crop reception by ID
router.get("/:id", getAllCropCollectionById);
// Create a new crop reception
//router.post("/", createReception);

// Update a crop reception
//router.put("/:id", updateReception);

// Delete a crop reception
router.delete("/:id", deleteCropCollection);

export default router;
