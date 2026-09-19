import { body } from "express-validator";

export const registerValidation = [
  body("fullname")
    .optional()
    .trim()
    .custom((val, { req }) => {
      const name = val || req.body.fullName || req.body.name;
      if (!name || name.trim().length < 2) {
        throw new Error("Full name must be at least 2 characters long");
      }
      return true;
    }),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("phone")
    .optional()
    .trim(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required"),
];

export const userValidation = [
  body("fullname")
    .optional()
    .trim()
    .custom((val, { req }) => {
      const name = val || req.body.fullName || req.body.name;
      if (!name || name.trim().length < 2) {
        throw new Error("Full name must be at least 2 characters long");
      }
      return true;
    }),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("phone")
    .optional()
    .trim(),
  body("password")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const userUpdateValidation = [
  body("fullname")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full name cannot be empty"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email format"),
  body("phone")
    .optional()
    .trim(),
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
