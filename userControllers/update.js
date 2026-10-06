
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { debug } from "../utils/debugLogger.js";

export const updateProfile = asyncHandler(async (req, res) => {
  // Request body log — password will be auto-redacted
  debug.log("Update profile request:", req.body);

  const user = await User.findById(req.user._id);
  if (!user) {
    debug.warn("User not found");
    res.status(404);
    throw new Error("User not found");
  }

  // Update name
  user.name = req.body.name || user.name;

  // Check email uniqueness if changing email
  if (req.body.email && req.body.email !== user.email) {
    debug.log(`Email change requested: ${user.email} → ${req.body.email}`);
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      debug.warn("Email already in use");
      res.status(400);
      throw new Error("This email is already in use!");
    }
    user.email = req.body.email;
  }

  // Handle password change request
  if (req.body.newPassword) {
    debug.log("Password change requested");

    if (!req.body.password) {
      debug.warn("Old password missing");
      res.status(400);
      throw new Error("Please provide your old password");
    }

    const isValid = await user.matchPassword(req.body.password);
    if (!isValid) {
      debug.warn("Incorrect old password");
      res.status(401);
      throw new Error("Old password is incorrect");
    }

    user.password = req.body.newPassword;
    debug.log("New password set — will be hashed on save");
  }

  const updatedUser = await user.save();
  debug.log(`User updated: ${updatedUser.email}`);

  // Generate new token — in case email or role changed
  const token = generateToken(updatedUser._id);

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    token,
  });
});