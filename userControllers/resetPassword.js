import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const resetPassword = asyncHandler(async (req, res) => {
  console.log("🔑 Reset password request with OTP:", req.body.otp);
  const { otp, password } = req.body;
  const user = await User.findOne({
    resetPasswordOTP: otp,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    console.warn("❌ Invalid or expired OTP");
    res.status(400);
    throw new Error("ইনভ্যালিড বা এক্সপায়ার্ড OTP!");
  }

  user.password = password;
  user.resetPasswordOTP = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  console.log(`✅ Password reset successful for: ${user.email}`);
  res.json({ success: true, message: "পাসওয়ার্ড রিসেট সফল!" });
});