
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { debug } from "../utils/debugLogger.js";

export const getUserUploads = asyncHandler(async (req, res) => {
  debug.log(`Fetching uploads for user: ${req.user._id}`);

  // Fetch only the uploads field
  const user = await User.findById(req.user._id).select("uploads");

  // Throw error if user is not found to prevent crashes
  if (!user) {
    debug.warn("User not found");
    res.status(404);
    throw new Error("User not found");
  }

  const count = user.uploads?.length || 0;
  debug.log(`Found ${count} uploads`);

  res.json({ uploads: user.uploads || [] });
});