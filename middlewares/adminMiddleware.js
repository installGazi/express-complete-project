export const adminMiddleware = (req, res, next) => {
  console.log(`🔐 Checking admin access for user: ${req.user?._id}`);
  if (req.user && req.user.role === "admin") {
    console.log(`✅ Admin access granted: ${req.user.email}`);
    return next();
  }
  console.warn("❌ Forbidden: Not an admin");
  return res.status(403).json({ message: "Forbidden: Admin access only" });
};