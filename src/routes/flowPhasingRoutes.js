import express from "express";
import {
  createFlowPhasing,
  getFlowPhasing,
} from "../controllers/flowPhasingControllers.js";

const router = express.Router();

//get factory flow phasing
router.get("/", getFlowPhasing);

// post factory flow phasing
router.post("/", createFlowPhasing);

export default router;
