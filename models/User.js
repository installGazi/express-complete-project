import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    isBlocked: { type: Boolean, default: false },
    warnings: { type: Number, default: 0 },
    resetPasswordOTP: String,
    resetPasswordExpire: Date,
    profilePic: { type: String, default: "" },
    uploads: [
      {
        url: { type: String, required: true },
        description: { type: String, default: "" },
        fileType: { type: String, enum: ["image", "video"], required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// ✅ পাসওয়ার্ড হ্যাশিং (Async/Await – Next নেই)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    console.log("⏭️ Password not modified, skipping hash");
    return;
  }
  console.log("🔒 Hashing password...");
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("✅ Password hashed successfully");
});

// ✅ পাসওয়ার্ড মিলানো
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log(`🔍 Comparing password for user: ${this.email}`);
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  console.log(`✅ Password match: ${isMatch}`);
  return isMatch;
};

const User = mongoose.model("User", userSchema);
export default User;