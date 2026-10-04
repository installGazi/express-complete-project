import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const loginUser = asyncHandler(async (req, res) => {
  console.log("📥 Login Request Body:", req.body);
  const { email, password } = req.body;

  console.log(`🔍 Finding user: ${email}`);
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    console.log(`✅ User found: ${user.email}`);

    if (user.isBlocked) {
      console.warn(`⚠️ User is blocked: ${user.email}`);
      res.status(401);
      throw new Error("আপনার অ্যাকাউন্ট ব্লক করা হয়েছে!");
    }

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // 🔥 এখানে পরিবর্তন
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } else {
    console.warn(`❌ Invalid credentials for: ${email}`);
    res.status(401);
    throw new Error("ইনভ্যালিড ইমেইল বা পাসওয়ার্ড");
  }
});

