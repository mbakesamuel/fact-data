import express from "express";
import {flowPhasing} from '../services/flowPhasing.js';

const router = express.Router();

// Get all crop receptions
router.post("/factory-flow-phasing", async (req, res) => {
  const { baseYear } = req.body;

  try {
    await flowPhasing(Number(baseYear));
    res
      .status(200)
      .json({ message: "Factory flow phasing generated successfully." });
  } catch (err) {
    console.error("Error in factory flow phasing:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
