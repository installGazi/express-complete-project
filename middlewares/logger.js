import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const logger = (req, res, next) => {
  const now = new Date().toLocaleString("bn-BD");
  const authHeader = req.headers.authorization;

  let userInfo = "🔒 Unauthorized User";

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userInfo = `👤 UserID: ${decoded.id}`;
    } catch (error) {
      userInfo = "❌ Invalid Token";
    }
  }

  console.log(`[${now}] ${req.method} ${req.originalUrl} | ${userInfo}`);
  next();
};

export default logger;