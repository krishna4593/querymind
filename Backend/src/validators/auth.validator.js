import { body, validationResult } from "express-validator";

const registerValidationRules = [
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required.")
		.isEmail()
		.withMessage("Please provide a valid email address.")
		.normalizeEmail(),

	body("password")
		.trim()
		.notEmpty()
		.withMessage("Password is required."),
];

export const registerValidator = async (req, res, next) => {
	await Promise.all(registerValidationRules.map((rule) => rule.run(req)));

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: "Validation failed.",
			errors: errors.array().map((error) => ({
				field: error.path,
				message: error.msg,
			})),
		});
	}

	next();
};

export const loginValidator = async (req, res, next) => {
	// Define validation rules for login (email and password).
	const loginValidationRules = [
		body("email")
			.trim()
			.notEmpty()
			.withMessage("Email is required.")
			.isEmail()
			.withMessage("Please provide a valid email address.")
			.normalizeEmail(),
		body("password")
			.trim()
			.notEmpty()
			.withMessage("Password is required."),
	];

	await Promise.all(loginValidationRules.map((rule) => rule.run(req)));

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: "Validation failed.",
			errors: errors.array().map((error) => ({
				field: error.path,
				message: error.msg,
			})),
		});
	}

	next();
};

