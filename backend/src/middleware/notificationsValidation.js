import { body, param } from "express-validator";

export const createNotificationValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Notification title is required"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Notification message content is required"),
  body("category")
    .optional()
    .isIn(["Inquiry", "Booking", "Feedback", "System", "Alert", "Promotional"])
    .withMessage("Invalid notification category"),
  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High", "Urgent"])
    .withMessage("Invalid notification priority"),
];

export const updateNotificationValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),
  body("message")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Message cannot be empty"),
  body("category")
    .optional()
    .isIn(["Inquiry", "Booking", "Feedback", "System", "Alert", "Promotional"])
    .withMessage("Invalid notification category"),
  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High", "Urgent"])
    .withMessage("Invalid notification priority"),
];

export const replyNotificationValidation = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Reply message content cannot be empty"),
  body("subject")
    .optional()
    .trim(),
  body("channel")
    .optional()
    .trim(),
];
