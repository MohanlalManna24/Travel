import { verifyAccessToken } from "../utils/token.js";
import { getUserById } from "../repository/users.repository.js";

export const authenticateUser = async (req, res, next) => {
  try {
    // 1. Extract token from HTTP-only Cookie or Authorization Header
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        error: "Authentication required. Please sign in to continue.",
        code: "UNAUTHORIZED",
      });
    }

    // 2. Verify token
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({
        error: "Access token is expired or invalid.",
        code: "TOKEN_EXPIRED",
      });
    }

    // 3. Verify user still exists in database
    const user = await getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        error: "User associated with this token no longer exists.",
        code: "USER_NOT_FOUND",
      });
    }

    if (user.status === "inactive") {
      return res.status(403).json({
        error: "Your account has been deactivated. Please contact support.",
        code: "ACCOUNT_INACTIVE",
      });
    }

    req.user = {
      ...decoded,
      status: user.status,
    };

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({ error: "Internal authentication error" });
  }
};
