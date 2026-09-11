import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { uploadToCloudinary } from "../middlewares/uploadMiddleware.js";

export const uploadFileGeneric = asyncHandler(async (req, res) => {
  console.log(`📤 Uploading file for user: ${req.user._id}`);
  if (!req.file) {
    console.warn("⚠️ No file uploaded");
    res.status(400);
    throw new Error("কোনো ফাইল আপলোড করা হয়নি!");
  }

  const { description = "" } = req.body;
  console.log("☁️ Uploading to Cloudinary...");
  const result = await uploadToCloudinary(req.file.buffer);
  console.log(`✅ Cloudinary upload successful: ${result.secure_url}`);
  const fileType = req.file.mimetype.startsWith("image") ? "image" : "video";

  const user = await User.findById(req.user._id);
  user.uploads.push({
    url: result.secure_url,
    description,
    fileType,
  });
  await user.save();
  console.log(`✅ File saved for user: ${user.email}`);

  res.json({
    url: result.secure_url,
    description,
    fileType,
    message: "ফাইল ও বিবরণ সেভ করা হয়েছে",
  });
});