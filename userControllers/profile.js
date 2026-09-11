import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const protectedRoute = asyncHandler(async (req, res) => {
  console.log(`🔒 Protected route accessed by user: ${req.user?._id}`);
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    console.log(`✅ User profile fetched: ${user.email}`);
    res.json({ user });
  } else {
    console.warn("❌ User not found");
    res.status(404);
    throw new Error("ইউজার পাওয়া যায়নি");
  }
});