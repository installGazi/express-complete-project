
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { debug } from "../utils/debugLogger.js";

export const registerUser = asyncHandler(async (req, res) => {
  // Request body log — password will be auto-redacted
  debug.log("Register Request Body:", req.body);

  const { name, email, password } = req.body;

  // Field validation
  if (!name || !email || !password) {
    debug.warn("Missing required fields");
    res.status(400);
    throw new Error("Name, email, and password are all required!");
  }

  // Check if user already exists
  debug.log(`Checking if user exists: ${email}`);
  const userExists = await User.findOne({ email });
  if (userExists) {
    debug.warn(`User already exists: ${email}`);
    res.status(400);
    throw new Error("User already exists!");
  }

  // Create new user
  debug.log("Creating new user...");
  const user = await User.create({ name, email, password });
  debug.log(`User created: ${user._id} - ${user.email}`);

  if (user) {
    // Generate JWT token
    const token = generateToken(user._id);
    debug.log("Setting cookie...");

    // Set httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Response with token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } else {
    debug.error("Invalid user data");
    res.status(400);
    throw new Error("Invalid user data");
  }
});