
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const isDev = process.env.NODE_ENV !== "production";

const logger = (req, res, next) => {
  // ✅ Production-এ silent
  if (!isDev) return next();

  const now = new Date().toLocaleString("bn-BD");
  const authHeader = req.headers.authorization;
  let userInfo = "🔒 Unauthorized User";

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userInfo = `👤 UserID: ${decoded.id}`;
    } catch {
      userInfo = "❌ Invalid Token";
    }
  }

  console.log(`[${now}] ${req.method} ${req.originalUrl} | ${userInfo}`);
  next();
};

export default logger;

