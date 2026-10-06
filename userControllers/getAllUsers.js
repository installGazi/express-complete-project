// userControllers/getAllUsers.js
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { debug } from "../utils/debugLogger.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  debug.log("Admin fetching all users");

  // Fetch all users excluding their passwords
  const users = await User.find({}).select("-password");

  debug.log(`Found ${users.length} users`);

  res.json({ users });
});