import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import userFullDetails from "./routes/userFullDetails.routes.js";
import destinations from "./routes/destinations.routes.js";
import bookingsRoutes from "./routes/bookings.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";
import adminAuthRoutes from "./routes/adminAuth.routes.js";
import { apiLimiter, authLimiter, submissionLimiter } from "./middleware/rateLimiter.js";

const app = express();

// 1. Security Headers via Helmet (with CORS and Cross-Origin Resource Sharing settings)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// 2. High-Performance Gzip/Brotli Compression for APIs
app.use(compression());

// 3. Defensive Payload Size Limits
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// 4. Strict CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server) or allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: Access denied from unauthorized origin"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

// 5. Global API Rate Limiting
app.use("/api/", apiLimiter);

// 6. Routes with Specialized Protection
app.use("/api/admin/auth", authLimiter, adminAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/user-details", userFullDetails);
app.use("/api/destinations", destinations);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/notifications", notificationsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Application Exception:", err);
  const status = err.status || 500;
  res.status(status).json({
    status,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;


