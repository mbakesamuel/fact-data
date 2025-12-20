import express from "express";
import { getDashboardStats } from "../controllers/dashboardControllers.js";

const router = express.Router();

// GET /api/dashboard/stats?factory_id=1
router.get("/stats", getDashboardStats);

export default router;
