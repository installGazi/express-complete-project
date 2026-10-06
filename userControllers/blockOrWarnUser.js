
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { debug } from "../utils/debugLogger.js";

export const blockOrWarnUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { action } = req.body;

  debug.log(`Admin action on user: ${userId}, action: ${action}`);

  const user = await User.findById(userId);
  if (!user) {
    debug.warn("User not found");
    res.status(404);
    throw new Error("User not found!");
  }

  // Block action
  if (action === "block") {
    user.isBlocked = true;
    await user.save();
    debug.log(`User blocked: ${user.email}`);
    return res.json({
      message: `User ${user.name} has been blocked!`,
      user,
    });
  }

  // Unblock action
  if (action === "unblock") {
    user.isBlocked = false;
    await user.save();
    debug.log(`User unblocked: ${user.email}`);
    return res.json({
      message: `User ${user.name} has been unblocked!`,
      user,
    });
  }

  // Warn action — increments warning count
  if (action === "warn") {
    user.warnings = (user.warnings || 0) + 1;
    await user.save();
    debug.log(`User warned: ${user.email} (total: ${user.warnings})`);
    return res.json({
      message: `User ${user.name} has been warned!`,
      user,
    });
  }

  // Error for unknown action
  debug.warn("Invalid action");
  res.status(400);
  throw new Error("Invalid action!");
});