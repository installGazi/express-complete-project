import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

export const forgotPassword = asyncHandler(async (req, res) => {
  console.log("📧 Forgot password request for:", req.body.email);
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    console.warn("❌ User not found with email:", email);
    res.status(404);
    throw new Error("এই ইমেইলে কোন ইউজার নেই!");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`🔑 OTP generated for ${email}: ${otp}`);
  user.resetPasswordOTP = otp;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  const message = `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">পাসওয়ার্ড রিসেট OTP</h1>
      <p>আপনার OTP কোড:</p>
      <div style="text-align: center; margin: 30px 0;">
        <div style="background-color: #4CAF50; color: white; padding: 14px 30px; font-size: 24px; font-weight: bold; display: inline-block; border-radius: 5px;">
          ${otp}
        </div>
      </div>
      <p>এই OTP ১০ মিনিটের মধ্যে বৈধ হবে।</p>
    </div>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: "পাসওয়ার্ড রিসেট OTP",
      text: `আপনার OTP: ${otp}`,
      html: message,
    });
    console.log(`✅ OTP email sent to ${user.email}`);
    res.json({
      success: true,
      message: "OTP ইমেইল করা হয়েছে!",
      otp: process.env.NODE_ENV === "production" ? undefined : otp,
    });
  } catch (error) {
    console.error(`❌ Email send failed: ${error.message}`);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500);
    throw new Error("ইমেইল পাঠানো যায়নি!");
  }
});