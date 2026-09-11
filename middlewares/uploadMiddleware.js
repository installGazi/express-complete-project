import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

console.log("☁️ Initializing Cloudinary...");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("✅ Cloudinary Config:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
  secret: process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing",
});

const storage = multer.memoryStorage();
const upload = multer({ storage });
console.log("✅ Multer configured");

export const uploadSingle = upload.single("file");

export const uploadToCloudinary = (buffer) => {
  console.log("☁️ Uploading to Cloudinary...");
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "uploads" },
      (error, result) => {
        if (result) {
          console.log(`✅ Cloudinary upload success: ${result.secure_url}`);
          resolve(result);
        } else {
          console.error(`❌ Cloudinary upload error: ${error.message}`);
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};