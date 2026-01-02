import express from "express";
import { factoryFlowPhasing } from "../controllers/flowPhasingControllers.js";

const router = express.Router();

// Get all crop receptions
router.post("/factory-flow-phasing", async (req, res) => {
  const { baseYear } = req.body;

  try {
    await factoryFlowPhasing(Number(baseYear));
    res
      .status(200)
      .json({ message: "Factory flow phasing generated successfully." });
  } catch (err) {
    console.error("Error in factoryFlowPhasing:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
