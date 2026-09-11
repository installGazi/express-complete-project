import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { uploadToCloudinary } from "../middlewares/uploadMiddleware.js";

export const uploadProfilePic = asyncHandler(async (req, res) => {
  console.log(`🖼️ Uploading profile pic for user: ${req.user._id}`);
  if (!req.file) {
    console.warn("⚠️ No file uploaded");
    res.status(400);
    throw new Error("কোনো ফাইল আপলোড করা হয়নি!");
  }

  console.log("☁️ Uploading to Cloudinary...");
  const result = await uploadToCloudinary(req.file.buffer);
  console.log(`✅ Cloudinary upload successful: ${result.secure_url}`);

  const user = await User.findById(req.user._id);
  if (user) {
    user.profilePic = result.secure_url;
    await user.save();
    console.log(`✅ Profile pic updated for: ${user.email}`);
    res.json({ profilePic: user.profilePic, message: "প্রোফাইল পিক আপডেট হয়েছে" });
  } else {
    console.warn("❌ User not found");
    res.status(404);
    throw new Error("ইউজার পাওয়া যায়নি");
  }
});