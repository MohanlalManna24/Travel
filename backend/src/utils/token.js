import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "ghure_ashi_access_jwt_secret_key_2026_secure_signature";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "ghure_ashi_refresh_jwt_secret_key_2026_secure_signature";

// Expiration intervals
export const ACCESS_TOKEN_EXPIRY = "15m";
export const REFRESH_TOKEN_EXPIRY = "7d";

// Generate short-lived Access Token (15m)
export const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    fullname: user.fullname || user.name,
    role: user.role || "traveler",
  };
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

// Generate long-lived Refresh Token (7d)
export const generateRefreshToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

// Verify Access Token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

// Standard Cookie Options for HTTP-Only Auth Cookies
export const getCookieOptions = (isRefresh = false) => {
  const maxAge = isRefresh
    ? 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    : 15 * 60 * 1000; // 15 minutes in milliseconds

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge,
  };
};
