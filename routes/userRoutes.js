import express from "express";
import { registerUser } from "../userControllers/register.js";
import { loginUser } from "../userControllers/login.js";
import { protectedRoute } from "../userControllers/profile.js";
import { verifyPassword } from "../userControllers/verifyPassword.js";
import { updateProfile } from "../userControllers/update.js";
import { forgotPassword } from "../userControllers/forgotPassword.js";
import { resetPassword } from "../userControllers/resetPassword.js";
import { getAllUsers } from "../userControllers/getAllUsers.js";
import { blockOrWarnUser } from "../userControllers/blockOrWarnUser.js";
import { uploadProfilePic } from "../userControllers/uploadProfilePic.js";
import { uploadFileGeneric } from "../userControllers/uploadFileGeneric.js";
import { getUserUploads } from "../userControllers/getUserUpload.js";
import { deleteUpload } from "../userControllers/deleteUpload.js";
import { deleteUser } from "../userControllers/deleteUser.js";

import { protect } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { uploadSingle } from "../middlewares/uploadMiddleware.js";

const router = express.Router();
console.log("🛣️ Setting up user routes...");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/protected", protect, protectedRoute);

router.put("/update", protect, updateProfile);
router.post("/verify-password", protect, verifyPassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/all", protect, adminMiddleware, getAllUsers);
router.put("/block/:userId", protect, adminMiddleware, blockOrWarnUser);
router.delete("/delete/:userId", protect, adminMiddleware, deleteUser);

router.post("/upload-profile-pic", protect, uploadSingle, uploadProfilePic);
router.post("/upload-file", protect, uploadSingle, uploadFileGeneric);
router.get("/my-uploads", protect, getUserUploads);
router.delete("/upload/:uploadId", protect, deleteUpload);

console.log("✅ User routes configured");
export default router;