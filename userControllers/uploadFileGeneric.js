
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { uploadToCloudinary } from "../middlewares/uploadMiddleware.js";
import { debug } from "../utils/debugLogger.js";

export const uploadFileGeneric = asyncHandler(async (req, res) => {
  debug.log(`Uploading file for user: ${req.user._id}`);

  // Check if file is missing
  if (!req.file) {
    debug.warn("No file uploaded");
    res.status(400);
    throw new Error("No file uploaded!");
  }

  // Description from body (optional)
  const { description = "" } = req.body;

  // Send buffer to Cloudinary
  debug.log("Uploading to Cloudinary...");
  const result = await uploadToCloudinary(req.file.buffer);
  debug.log(`Cloudinary upload successful: ${result.secure_url}`);

  // Detect file type from mimetype
  const fileType = req.file.mimetype.startsWith("image") ? "image" : "video";

  // Push new upload into user's uploads array
  const user = await User.findById(req.user._id);

  if (!user) {
    debug.warn("User not found");
    res.status(404);
    throw new Error("User not found!");
  }

  user.uploads.push({
    url: result.secure_url,
    description,
    fileType,
  });
  await user.save();

  debug.log(`File saved for user: ${user.email}`);

  res.json({
    url: result.secure_url,
    description,
    fileType,
    message: "File and description saved successfully",
  });
});