// userControllers/resetPassword.js
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { debug } from "../utils/debugLogger.js";

export const resetPassword = asyncHandler(async (req, res) => {
  // Request body log — OTP and password will be auto-redacted
  debug.log("Reset password request:", req.body);

  const { otp, password } = req.body;

  // Verify OTP — check for valid and non-expired token
  const user = await User.findOne({
    resetPasswordOTP: otp,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    debug.warn("Invalid or expired OTP");
    res.status(400);
    throw new Error("Invalid or expired OTP!");
  }

  // Set new password — pre-save hook will hash it automatically
  user.password = password;
  user.resetPasswordOTP = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  debug.log(`Password reset successful for: ${user.email}`);

  res.json({ success: true, message: "Password reset successful!" });
});