import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const deleteUser = asyncHandler(async (req, res) => {
  console.log(`🗑️ Admin deleting user: ${req.params.userId}`);
  const user = await User.findById(req.params.userId);
  if (!user) {
    console.warn("❌ User not found");
    res.status(404);
    throw new Error("ইউজার পাওয়া যায়নি");
  }

  if (user._id.toString() === req.user._id.toString()) {
    console.warn("⚠️ Cannot delete self");
    res.status(400);
    throw new Error("নিজের অ্যাকাউন্ট ডিলিট করতে পারবেন না");
  }

  await user.deleteOne();
  console.log(`✅ User ${user.email} deleted`);
  res.json({ success: true, message: `ইউজার ${user.name} ডিলিট করা হয়েছে` });
});