import jwt from "jsonwebtoken";

const getAdminJwtSecret = () =>
  process.env.ADMIN_JWT_SECRET || "ghure_ashi_admin_master_jwt_secret_key_2026_super_secure";

export const requireAdminAuth = (req, res, next) => {
  try {
    let token = req.cookies?.adminToken;

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Admin authentication required. Please sign in as an administrator.",
        code: "UNAUTHORIZED_ADMIN",
      });
    }

    const decoded = jwt.verify(token, getAdminJwtSecret());

    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access denied. Valid admin privileges required.",
        code: "FORBIDDEN_NOT_ADMIN",
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Admin session has expired or is invalid.",
      code: "INVALID_ADMIN_TOKEN",
    });
  }
};
