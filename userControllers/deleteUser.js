
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { debug } from "../utils/debugLogger.js";

export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  debug.log(`Admin deleting user: ${userId}`);

  // Find user
  const user = await User.findById(userId);

  if (!user) {
    debug.warn("User not found");
    res.status(404);
    throw new Error("User not found");
  }

  // Prevent admin from deleting their own account
  if (user._id.toString() === req.user._id.toString()) {
    debug.warn("Admin attempted to delete self");
    res.status(400);
    throw new Error("You cannot delete your own account");
  }

  // Delete user
  await user.deleteOne();

  debug.log(`User deleted: ${user.email}`);

  res.json({
    success: true,
    message: `User ${user.name} deleted successfully`,
  });
});