
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { debug } from "../utils/debugLogger.js";

export const protectedRoute = asyncHandler(async (req, res) => {
  debug.log(`Protected route accessed by user: ${req.user?._id}`);

  // Fetch all user data excluding the password
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    debug.log(`User profile fetched: ${user.email}`);
    res.json({ user });
  } else {
    debug.warn("User not found");
    res.status(404);
    throw new Error("User not found");
  }
});