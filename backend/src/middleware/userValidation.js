import { body } from "express-validator";

export const userValidation = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 7, max: 20 })
    .withMessage("Phone number must be between 7 and 20 digits"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const userUpdateValidation = [
  body("fullname")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full name cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email format"),
  body("phone")
    .optional()
    .trim()
    .isLength({ min: 7, max: 20 })
    .withMessage("Phone number must be between 7 and 20 digits"),
  body("password")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long if provided"),
  body("status")
    .optional()
    .trim()
    .isIn(["active", "inactive", "Active", "Inactive", "Pending", "Suspended"])
    .withMessage("Invalid status value"),
];

export default userValidation;

