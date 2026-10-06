
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { debug } from "../utils/debugLogger.js";

export const loginUser = asyncHandler(async (req, res) => {
  // Request body log — password will be auto-redacted
  debug.log("Login Request Body:", req.body);

  const { email, password } = req.body;

  // Find user
  debug.log(`Finding user: ${email}`);
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    debug.log(`User found: ${user.email}`);

    // Prevent access if user is blocked
    if (user.isBlocked) {
      debug.warn(`User is blocked: ${user.email}`);
      res.status(401);
      throw new Error("Your account has been blocked!");
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Set httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Response with token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } else {
    debug.warn(`Invalid credentials for: ${email}`);
    res.status(401);
    throw new Error("Invalid email or password");
  }
});