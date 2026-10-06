// userControllers/uploadProfilePic.js
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { uploadToCloudinary } from "../middlewares/uploadMiddleware.js";
import { debug } from "../utils/debugLogger.js";

export const uploadProfilePic = asyncHandler(async (req, res) => {
  debug.log(`Uploading profile pic for user: ${req.user._id}`);

  // Return error if no file is uploaded
  if (!req.file) {
    debug.warn("No file uploaded");
    res.status(400);
    throw new Error("No file uploaded!");
  }

  debug.log("Uploading to Cloudinary...");

  // Send buffer to Cloudinary
  const result = await uploadToCloudinary(req.file.buffer);

  debug.log(`Cloudinary upload successful: ${result.secure_url}`);

  const user = await User.findById(req.user._id);

  if (user) {
    user.profilePic = result.secure_url;
    await user.save();

    debug.log(`Profile pic updated for: ${user.email}`);

    res.json({
      profilePic: user.profilePic,
      message: "Profile picture updated successfully",
    });
  } else {
    debug.warn("User not found");
    res.status(404);
    throw new Error("User not found");
  }
});