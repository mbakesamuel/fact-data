import express from "express";
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

app.use(cors());

//init some middlewares

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
