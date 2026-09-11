import jwt from "jsonwebtoken";

const generateToken = (id) => {
  console.log(`🔐 Generating token for user ID: ${id}`);
  try {
    const token = jwt.sign(
      { id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );
    console.log("✅ Token generated successfully");
    return token;
  } catch (error) {
    console.error(`❌ Token generation failed: ${error.message}`);
    throw error;
  }
};

export default generateToken;