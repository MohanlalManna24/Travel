import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

const getAdminJwtSecret = () =>
  process.env.ADMIN_JWT_SECRET || "ghure_ashi_admin_master_jwt_secret_key_2026_super_secure";

// ============================================================================
// 1. ADMIN LOGIN
// ============================================================================
router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username/Email and Password are required.",
      });
    }

    const envUsername = (process.env.ADMIN_USERNAME || "admin").toLowerCase().trim();
    const envEmail = (process.env.ADMIN_EMAIL || "admin@travel.com").toLowerCase().trim();
    const envPassword = process.env.ADMIN_PASSWORD || "admin@ghureashi2026";

    const inputUser = username.toLowerCase().trim();
    const isUserValid = inputUser === envUsername || inputUser === envEmail;
    const isPassValid = password === envPassword;

    if (!isUserValid || !isPassValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials. Access denied.",
      });
    }

    // Sign Admin JWT Token
    const adminPayload = {
      role: "admin",
      username: process.env.ADMIN_USERNAME || "admin",
      email: process.env.ADMIN_EMAIL || "admin@travel.com",
      fullname: "Super Administrator",
    };

    const token = jwt.sign(adminPayload, getAdminJwtSecret(), {
      expiresIn: "24h",
    });

    // Set HTTP-Only Cookie
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.status(200).json({
      success: true,
      message: "Admin authentication successful!",
      admin: adminPayload,
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during admin login.",
    });
  }
});

// ============================================================================
// 2. VERIFY ADMIN SESSION
// ============================================================================
router.get("/verify", (req, res) => {
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
        authenticated: false,
        message: "No active admin session found.",
      });
    }

    const decoded = jwt.verify(token, getAdminJwtSecret());

    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        authenticated: false,
        message: "Invalid admin token signature or unauthorized role.",
      });
    }

    return res.status(200).json({
      success: true,
      authenticated: true,
      admin: {
        role: decoded.role,
        username: decoded.username,
        email: decoded.email,
        fullname: decoded.fullname || "Super Administrator",
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      authenticated: false,
      message: "Admin session has expired or is invalid.",
    });
  }
});

// ============================================================================
// 3. ADMIN LOGOUT
// ============================================================================
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Admin session logged out successfully.",
    });
  } catch (error) {
    console.error("Admin logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to log out admin session.",
    });
  }
});

export default router;
