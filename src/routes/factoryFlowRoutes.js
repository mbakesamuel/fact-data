import express from "express";
import {
  deleteFactoryFlow,
  getAllFactoryFlow,
  getAllFactoryFlowById,
} from "../controllers/factoryFlowControllers.js";

//import { requireAuth } from "@clerk/express";

const router = express.Router();

// Get all factory flows
router.get("/", getAllFactoryFlow);

// Get a single factory flow by ID
router.get("/:id", getAllFactoryFlowById);
// Create a new factory flow
//router.post("/", createReception);

// Update a crop reception
//router.put("/:id", updateReception);

// Delete a factory flow
router.delete("/:id", deleteFactoryFlow);

export default router;
