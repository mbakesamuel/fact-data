import express from "express";
import { clerkClient, clerkMiddleware, getAuth } from "@clerk/express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";

import cropProcessingRoutes from "./routes/cropProcessingRoutes.js";
import cropReceptionRoutes from "./routes/cropReceptionRoutes.js";
import factoryRoutes from "./routes/factoryRoutes.js";
import fieldSupplyRoutes from "./routes/fieldSupplyRoutes.js";
import cropSupplyUnitRoutes from "./routes/cropSupplyUnitRoutes.js";
import factoryGradeRoutes from "./routes/factoryGradeRoutes.js";

dotenv.config();
const app = express();

app.use(cors());

// Parse JSON
app.use(express.json());
app.use(clerkMiddleware())

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "all systems ok" });
});

// Routes
app.use("/api/factory", factoryRoutes);
app.use("/api/field-supplies", fieldSupplyRoutes);
app.use("/api/factory-grades", factoryGradeRoutes);
app.use("/api/crop-supply-units", cropSupplyUnitRoutes);
app.use("/api/crop-receptions", cropReceptionRoutes);
app.use("/api/crop-processings", cropProcessingRoutes);

// Catch‑all 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Backend error:", err.message);
  res.status(err.status || 500).json({ error: err.message });
});

// Start server
initDB().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });
});
