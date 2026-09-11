import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  console.log("📋 Admin fetching all users");
  const users = await User.find({}).select("-password");
  console.log(`✅ Found ${users.length} users`);
  res.json({ users });
});