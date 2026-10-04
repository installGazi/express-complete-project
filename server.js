import dotenv from "dotenv";
dotenv.config();

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
}

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import logger from "./middlewares/logger.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

console.log("🚀 Starting server...");
const app = express();
connectDB();

// =========================================
// CORS Configuration
// =========================================
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
console.log("✅ CORS configured");

// =========================================
// Middleware Setup
// =========================================
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
console.log("✅ Middleware configured");

// =========================================
// Cloudinary Status Check
// =========================================
console.log("🔍 Cloudinary Status:");
console.log(`  Name: ${process.env.CLOUDINARY_CLOUD_NAME || "❌ Not set"}`);
console.log(`  Key: ${process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing"}`);
console.log(`  Secret: ${process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing"}`);

// =========================================
// Root Route
// =========================================
app.get("/", (req, res) => {
  console.log("🏠 Root endpoint hit");
  res.send("🚀 API is running...");
});

// =========================================
// User Routes
// =========================================
app.use("/api/users", userRoutes);
console.log("✅ Routes configured");

// =========================================
// Error Handling
// =========================================
app.use(notFound);
app.use(errorHandler);

// =========================================
// Start Server
// =========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
});






