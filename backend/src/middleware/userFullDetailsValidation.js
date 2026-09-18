import { body } from "express-validator";

const userFullDetailsValidation = [
	body("userId")
		.if((value, { req }) => !req.params.userId)
		.notEmpty()
		.withMessage("User ID is required")
		.isInt({ min: 1 })
		.withMessage("User ID must be a positive integer"),
	body("profileImg")
		.optional({ values: "falsy" })
		.isLength({ max: 300 })
		.withMessage("Profile image must be 300 characters or fewer"),
	body("DOB")
		.notEmpty()
		.withMessage("Date of birth is required")
		.isISO8601()
		.withMessage("Date of birth must be a valid date"),
	body("gender")
		.notEmpty()
		.withMessage("Gender is required")
		.isIn(["Male", "Female", "Other"])
		.withMessage("Gender must be Male, Female, or Other"),
	body("address_line1")
		.trim()
		.notEmpty()
		.withMessage("Address line 1 is required")
		.isLength({ max: 500 })
		.withMessage("Address line 1 must be 500 characters or fewer"),
	body("address_line2")
		.optional({ values: "falsy" })
		.trim()
		.isLength({ max: 500 })
		.withMessage("Address line 2 must be 500 characters or fewer"),
	body("city")
		.trim()
		.notEmpty()
		.withMessage("City is required")
		.isLength({ max: 100 })
		.withMessage("City must be 100 characters or fewer"),
	body("state")
		.trim()
		.notEmpty()
		.withMessage("State is required")
		.isLength({ max: 100 })
		.withMessage("State must be 100 characters or fewer"),
	body("pin_code")
		.trim()
		.notEmpty()
		.withMessage("PIN code is required")
		.isLength({ max: 10 })
		.withMessage("PIN code must be 10 characters or fewer"),
	body("country")
		.trim()
		.notEmpty()
		.withMessage("Country is required")
		.isLength({ max: 100 })
		.withMessage("Country must be 100 characters or fewer"),
	body("nationality")
		.trim()
		.notEmpty()
		.withMessage("Nationality is required")
		.isLength({ max: 100 })
		.withMessage("Nationality must be 100 characters or fewer"),
	body("passport_number")
		.trim()
		.notEmpty()
		.withMessage("Passport number is required")
		.isLength({ max: 50 })
		.withMessage("Passport number must be 50 characters or fewer"),
	body("preferred_airport")
		.optional({ values: "falsy" })
		.trim()
		.isLength({ max: 100 })
		.withMessage("Preferred airport must be 100 characters or fewer"),
	body("preferred_seat")
		.optional({ values: "falsy" })
		.trim()
		.isLength({ max: 100 })
		.withMessage("Preferred seat must be 100 characters or fewer"),
	body("dietary_preferences")
		.optional({ values: "falsy" })
		.trim()
		.isLength({ max: 200 })
		.withMessage("Dietary preferences must be 200 characters or fewer"),
	body("medical_notes")
		.optional({ values: "falsy" })
		.trim()
		.isLength({ max: 500 })
		.withMessage("Medical notes must be 500 characters or fewer"),
	body("Emergency_contact_name")
		.optional({ values: "falsy" })
		.trim()
		.isLength({ max: 100 })
		.withMessage("Emergency contact name must be 100 characters or fewer"),
	body("Emergency_contact_number")
		.optional({ values: "falsy" })
		.trim()
		.isLength({ max: 10 })
		.withMessage("Emergency contact number must be 10 characters or fewer"),
	body("Emergency_contact_relationship")
		.optional({ values: "falsy" })
		.trim()
        .isLength({ min:2, max: 100 })
		.withMessage("Emergency contact relationship must be 2 to 100 characters or fewer"),
];

export default userFullDetailsValidation;
