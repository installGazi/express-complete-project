import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const updateProfile = asyncHandler(async (req, res) => {
  console.log(`🔄 Updating profile for user: ${req.user._id}`);
  const user = await User.findById(req.user._id);
  if (!user) {
    console.warn("❌ User not found");
    res.status(404);
    throw new Error("ইউজার পাওয়া যায়নি");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  if (req.body.newPassword) {
    console.log("🔑 Password change requested");
    if (!req.body.password) {
      console.warn("⚠️ Old password missing");
      res.status(400);
      throw new Error("পুরানো পাসওয়ার্ড প্রদান করুন");
    }
    const isValid = await user.matchPassword(req.body.password);
    if (!isValid) {
      console.warn("❌ Incorrect old password");
      res.status(401);
      throw new Error("পুরানো পাসওয়ার্ড সঠিক নয়");
    }
    user.password = req.body.newPassword;
    console.log("✅ New password set");
  }

  const updatedUser = await user.save();
  console.log(`✅ User updated: ${updatedUser.email}`);
  const token = generateToken(updatedUser._id);

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    token,
  });
});