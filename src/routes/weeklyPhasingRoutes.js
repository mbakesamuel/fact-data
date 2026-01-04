import express from "express";
import {
  CreateWeeklyPhasing,
  getDailyEstimate,
} from "../controllers/PhasingControllers.js";

const router = express.Router();

//POST
router.post("/", CreateWeeklyPhasing);

// GET /api/crop-phasing
router.get("/daily", getDailyEstimate);

//add other routes if needed

export default router;
