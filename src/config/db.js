// db.js
import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// Create a Neon SQL client
export const sql = neon(process.env.DATABASE_URL);

// Optional: check connection on startup
export const initDB = async () => {
  try {
    // Run a simple query to confirm connection
    await sql`SELECT 1`;
    console.log("✅ Database connection initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
};
