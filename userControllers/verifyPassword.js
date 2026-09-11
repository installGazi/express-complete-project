import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const verifyPassword = asyncHandler(async (req, res) => {
  console.log(`🔐 Verify password for user: ${req.user._id}`);
  const user = await User.findById(req.user._id);
  if (!user) {
    console.warn("❌ User not found");
    res.status(404);
    throw new Error("ইউজার পাওয়া যায়নি");
  }

  const { password } = req.body;
  if (!password) {
    console.warn("⚠️ No password provided");
    res.status(400);
    throw new Error("পাসওয়ার্ড প্রদান করুন");
  }

  const isValid = await user.matchPassword(password);
  if (isValid) {
    console.log("✅ Password verified");
    res.json({ success: true, valid: true, message: "পাসওয়ার্ড সঠিক" });
  } else {
    console.warn("❌ Incorrect password");
    res.status(401).json({ success: false, valid: false, message: "পাসওয়ার্ড ভুল" });
  }
});