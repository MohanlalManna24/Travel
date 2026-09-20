import express from "express";
import {
  fetchAllNotifications,
  fetchNotificationById,
  createNewNotification,
  updateNotificationById,
  toggleNotificationRead,
  markAllAsRead,
  replyToNotification,
  deleteNotificationById,
  handleBulkActions,
} from "../controllers/notifications.controllers.js";
import {
  createNotificationValidation,
  updateNotificationValidation,
  replyNotificationValidation,
} from "../middleware/notificationsValidation.js";
import { submissionLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Bulk operations & global endpoints
router.get("/", fetchAllNotifications);
router.post("/", submissionLimiter, createNotificationValidation, createNewNotification);
router.patch("/mark-all-read", markAllAsRead);
router.post("/bulk-actions", handleBulkActions);

// Individual notification routes
router.get("/:id", fetchNotificationById);
router.put("/:id", updateNotificationValidation, updateNotificationById);
router.patch("/:id/read", toggleNotificationRead);
router.post("/:id/reply", replyNotificationValidation, replyToNotification);
router.delete("/:id", deleteNotificationById);

export default router;
