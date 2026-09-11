import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  console.log("🔒 Checking authorization...");

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔑 Token found, verifying...");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`✅ Token verified for user ID: ${decoded.id}`);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        console.warn("❌ User not found for token");
        res.status(401);
        throw new Error("User not found");
      }
      console.log(`✅ User authenticated: ${req.user.email}`);
      return next();
    } catch (err) {
      console.error(`❌ Auth error: ${err.message}`);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    console.warn("⚠️ No token provided");
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});