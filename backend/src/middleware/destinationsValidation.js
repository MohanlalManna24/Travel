import { body } from "express-validator";

export const destinationsValidation = [
  body("title")
    .custom((value, { req }) => {
      const titleOrName = value || req.body.name;
      if (!titleOrName || !String(titleOrName).trim()) {
        throw new Error("Title or Name of destination is required");
      }
      return true;
    }),
  body("image")
    .trim()
    .notEmpty()
    .withMessage("Image URL is required")
    .bail()
    .isLength({ max: 500 })
    .withMessage("Image must be 500 characters or fewer"),
  body("price")
    .custom((value, { req }) => {
      const priceVal = value ?? req.body.pricePerHead;
      if (priceVal === undefined || priceVal === null || isNaN(Number(priceVal))) {
        throw new Error("Price is required and must be a valid number");
      }
      return true;
    }),
  body("days")
    .optional({ checkFalsy: true })
    .custom((value) => {
      if (value && (isNaN(Number(value)) || Number(value) < 1)) {
        throw new Error("Days must be a positive integer");
      }
      return true;
    }),
];

export const destinationsUpdateValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty"),
  body("image")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Image cannot be empty"),
  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a valid number"),
  body("pricePerHead")
    .optional()
    .isNumeric()
    .withMessage("Price per head must be a valid number"),
  body("days")
    .optional()
    .isNumeric()
    .withMessage("Days must be a valid number"),
];

export default destinationsValidation;

