import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const getUserUploads = asyncHandler(async (req, res) => {
  console.log(`📂 Fetching uploads for user: ${req.user._id}`);
  const user = await User.findById(req.user._id).select("uploads");
  console.log(`✅ Found ${user.uploads?.length || 0} uploads`);
  res.json({ uploads: user.uploads || [] });
});