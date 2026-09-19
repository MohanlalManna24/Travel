import { body } from "express-validator";

export const bookingsValidation = [
  body("customerName")
    .custom((val, { req }) => {
      const name = val || req.body.customer?.name;
      if (!name || !String(name).trim()) {
        throw new Error("Customer name is required");
      }
      return true;
    }),
  body("customerEmail")
    .custom((val, { req }) => {
      const email = val || req.body.customer?.email;
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error("Valid customer email is required");
      }
      return true;
    }),
  body("startDate")
    .notEmpty()
    .withMessage("Trip start date is required"),
  body("endDate")
    .notEmpty()
    .withMessage("Trip end date is required"),
];

export const bookingsUpdateValidation = [
  body("customerEmail")
    .optional()
    .isEmail()
    .withMessage("Invalid email format"),
  body("totalAmount")
    .optional()
    .isNumeric()
    .withMessage("Total amount must be a number"),
];

export default bookingsValidation;
