import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const deleteUpload = asyncHandler(async (req, res) => {
  console.log(`🗑️ Deleting upload ${req.params.uploadId} for user: ${req.user._id}`);
  const { uploadId } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) {
    console.warn("❌ User not found");
    res.status(404);
    throw new Error("ইউজার পাওয়া যায়নি");
  }

  const initialLength = user.uploads.length;
  user.uploads = user.uploads.filter((u) => u._id.toString() !== uploadId);

  if (user.uploads.length === initialLength) {
    console.warn("❌ Upload not found");
    res.status(404);
    throw new Error("আপলোড আইটেম পাওয়া যায়নি");
  }

  await user.save();
  console.log(`✅ Upload deleted, remaining: ${user.uploads.length}`);
  res.json({ message: "আইটেম মুছে ফেলা হয়েছে", uploads: user.uploads });
});