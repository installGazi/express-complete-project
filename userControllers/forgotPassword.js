
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import { debug } from "../utils/debugLogger.js";

export const forgotPassword = asyncHandler(async (req, res) => {
  // Request body log — OTP will be auto-redacted
  debug.log("Forgot password request:", req.body);

  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    debug.warn(`User not found with email: ${email}`);
    res.status(404);
    throw new Error("No user found with this email!");
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  debug.log(`OTP generated for ${email}: ***REDACTED***`);

  // Save OTP — valid for 10 minutes
  user.resetPasswordOTP = otp;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  // Email template
  const message = `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Password Reset OTP</h1>
      <p>Your OTP code is:</p>
      <div style="text-align: center; margin: 30px 0;">
        <div style="background-color: #4CAF50; color: white; padding: 14px 30px; font-size: 24px; font-weight: bold; display: inline-block; border-radius: 5px;">
          ${otp}
        </div>
      </div>
      <p>This OTP is valid for 10 minutes.</p>
    </div>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP: ${otp}`,
      html: message,
    });

    debug.log(`OTP email sent to ${user.email}`);

    res.json({
      success: true,
      message: "OTP sent via email!",
      // OTP will not be included in the response in production
      otp: process.env.NODE_ENV === "production" ? undefined : otp,
    });
  } catch (error) {
    debug.error(`Email send failed: ${error.message}`);

    // Clean up OTP on failure
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(500);
    throw new Error("Failed to send email!");
  }
});