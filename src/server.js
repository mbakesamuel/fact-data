/* import express from "express";
import cors from "cors";
import { initDB } from "./config/db.js";
import dotenv from "dotenv";
import cropProcessingRoutes from "./routes/cropProcessingRoutes.js";
import cropReceptionRoutes from "./routes/cropReceptionRoutes.js";
import factoryRoutes from "./routes/factoryRoutes.js";

//load environment variables from .env file
dotenv.config();

//initialize the app and prisma.
const app = express();

// Decide allowed origins based on environment
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://your-frontend.com"] // ✅ only your deployed frontend
    : ["*"]; // ✅ allow every

//app.use(cors());
app.use(
  cors({
    origin: "http://localhost:8081", // allow your Expo web app
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

//for health checks, define a health url
app.get("/api/health", async (req, res) => {
  res.status(200).json({ message: "all systems ok" });
});

app.use("/api/crop-receptions", cropReceptionRoutes);
app.use("/api/crop-processings", cropProcessingRoutes);
app.use("/api/factory", factoryRoutes);

initDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
 */

// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";

// Import route modules
import cropProcessingRoutes from "./routes/cropProcessingRoutes.js";
import cropReceptionRoutes from "./routes/cropReceptionRoutes.js";
import factoryRoutes from "./routes/factoryRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Allowed origins for CORS
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://your-frontend.com"] // ✅ replace with your deployed frontend domain
    : [
        "http://localhost:8081", // Expo web dev server
        "http://localhost:19006", // Expo Metro bundler default
        "http://127.0.0.1:8081", // alternative localhost
      ];

// Apply CORS middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON request bodies
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "all systems ok" });
});

// API routes
app.use("/api/factory", factoryRoutes);
app.use("/api/crop-receptions", cropReceptionRoutes);
app.use("/api/crop-processings", cropProcessingRoutes);

// Global error handler (optional, but recommended)
app.use((err, req, res, next) => {
  console.error("❌ Backend error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// Initialize DB and start server
initDB().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
  });
});
