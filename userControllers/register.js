import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  console.log("📥 Register Request Body:", req.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.warn("⚠️ Missing required fields");
    res.status(400);
    throw new Error("নাম, ইমেইল ও পাসওয়ার্ড সব প্রয়োজন!");
  }

  console.log(`🔍 Checking if user exists: ${email}`);
  const userExists = await User.findOne({ email });
  if (userExists) {
    console.warn(`⚠️ User already exists: ${email}`);
    res.status(400);
    throw new Error("ইউজার ইতিমধ্যে রয়েছে!");
  }

  console.log("🆕 Creating new user...");
  const user = await User.create({ name, email, password });
  console.log(`✅ User Created: ${user._id} - ${user.email}`);

  if (user) {
    const token = generateToken(user._id);
    console.log("🍪 Setting cookie...");
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // 🔥 এখানে পরিবর্তন
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } else {
    console.error("❌ Invalid user data");
    res.status(400);
    throw new Error("ইনভ্যালিড ইউজার ডেটা");
  }
});

