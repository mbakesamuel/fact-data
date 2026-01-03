import express from "express";
import {
  CreateWeeklyPhasing,
  getWeeklyPhasing,
} from "../controllers/weeklyPhasingControllers.js";

const router = express.Router();

//POST
router.post("/", CreateWeeklyPhasing);

// GET /api/weekly-phasing
router.get("/", getWeeklyPhasing);

//add other routes if needed

export default router;
