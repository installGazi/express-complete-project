
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { debug } from "../utils/debugLogger.js";

export const verifyPassword = asyncHandler(async (req, res) => {
  // Request body log — password will be auto-redacted
  debug.log("Verify password request:", req.body);

  const user = await User.findById(req.user._id);
  if (!user) {
    debug.warn("User not found");
    res.status(404);
    throw new Error("User not found");
  }

  const { password } = req.body;

  // Return error if no password is provided
  if (!password) {
    debug.warn("No password provided");
    res.status(400);
    throw new Error("Please provide a password");
  }

  // Verify password match
  const isValid = await user.matchPassword(password);

  if (isValid) {
    debug.log("Password verified");
    res.json({ success: true, valid: true, message: "Password is correct" });
  } else {
    debug.warn("Incorrect password");
    res.status(401).json({
      success: false,
      valid: false,
      message: "Incorrect password",
    });
  }
});