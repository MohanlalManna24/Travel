import { body } from "express-validator";

const destinationsValidation = [
	body("title")
		.trim()
		.notEmpty()
		.withMessage("Title is required")
		.bail()
		.isLength({ max: 150 })
		.withMessage("Title must be 150 characters or fewer"),
	body("description")
		.optional({ values: "falsy" })
		.trim(),
	body("image")
		.trim()
		.notEmpty()
		.withMessage("Image is required")
		.bail()
		.isLength({ max: 300 })
		.withMessage("Image must be 300 characters or fewer"),
	body("country")
		.default("India")
		.optional({ values: "falsy" })
		.trim()
		.isLength({ max: 100 })
		.withMessage("Country must be 100 characters or fewer"),
	body("state")
		.optional({ values: "falsy" })
		.trim()
		.isLength({ max: 100 })
		.withMessage("State must be 100 characters or fewer"),
	body("price")
		.notEmpty()
		.withMessage("Price is required")
		.bail()
		.isInt({ min: 0 })
		.withMessage("Price must be a non-negative integer"),
	body("days")
		.notEmpty()
		.withMessage("Days is required")
		.bail()
		.isInt({ min: 1 })
		.withMessage("Days must be a positive integer"),
];

export default destinationsValidation;
