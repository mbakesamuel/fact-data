import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";

import cropProcessingRoutes from "./routes/cropProcessingRoutes.js";
import cropReceptionRoutes from "./routes/cropReceptionRoutes.js";
import factoryRoutes from "./routes/factoryRoutes.js";

dotenv.config();
const app = express();

// Allowed origins
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://your-frontend.com"] // replace with your deployed frontend
    : [
        "http://localhost:8081", // Expo web dev
        "http://localhost:19006", // Metro bundler
        "http://127.0.0.1:8081", // alternative localhost
      ];

// Apply CORS once with custom config
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      const err = new Error("Not allowed by CORS");
      err.status = 403;
      return callback(err);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Parse JSON
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "all systems ok" });
});

// Routes
app.use("/api/factory", factoryRoutes);
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
