import express from "express";
import {
  CreateWeeklyPhasing,
  getPhasingEstimates,
} from "../controllers/PhasingControllers.js";

const router = express.Router();

//POST
router.post("/", CreateWeeklyPhasing);

// GET /api/crop-phasing
router.get("/", getPhasingEstimates);

//add other routes if needed

export default router;
