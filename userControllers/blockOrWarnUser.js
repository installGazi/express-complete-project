import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const blockOrWarnUser = asyncHandler(async (req, res) => {
  console.log(`🛡️ Admin action on user: ${req.params.userId} - Action: ${req.body.action}`);
  const { userId } = req.params;
  const { action } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    console.warn("❌ User not found");
    res.status(404);
    throw new Error("ইউজার পাওয়া যায়নি!");
  }

  if (action === "block") {
    user.isBlocked = true;
    await user.save();
    console.log(`✅ User ${user.email} blocked`);
    res.json({ message: `ইউজার ${user.name} ব্লক করা হয়েছে!`, user });
  } else if (action === "warn") {
    user.warnings = (user.warnings || 0) + 1;
    await user.save();
    console.log(`⚠️ User ${user.email} warned (${user.warnings})`);
    res.json({ message: `ইউজার ${user.name} কে সতর্ক করা হয়েছে!`, user });
  } else {
    console.warn("❌ Invalid action");
    res.status(400);
    throw new Error("অবৈধ একশন!");
  }
});