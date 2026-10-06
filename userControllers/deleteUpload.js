
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { debug } from "../utils/debugLogger.js";

export const deleteUpload = asyncHandler(async (req, res) => {
  const { uploadId } = req.params;

  debug.log(`Deleting upload ${uploadId} for user: ${req.user._id}`);

  const user = await User.findById(req.user._id);

  if (!user) {
    debug.warn("User not found");
    res.status(404);
    throw new Error("User not found");
  }

  // Initial count — used for verification
  const initialLength = user.uploads.length;

  // Keep all uploads except the specified uploadId
  user.uploads = user.uploads.filter((u) => u._id.toString() !== uploadId);

  // If length hasn't changed, the item was not found
  if (user.uploads.length === initialLength) {
    debug.warn("Upload not found");
    res.status(404);
    throw new Error("Uploaded item not found");
  }

  await user.save();

  debug.log(`Upload deleted, remaining: ${user.uploads.length}`);

  res.json({
    message: "Item deleted successfully",
    uploads: user.uploads,
  });
});