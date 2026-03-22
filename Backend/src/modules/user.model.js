import bcrypt from "bcryptjs";

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		// Public display name used across the app.
		username: {
			type: String,
			required: true,
			trim: true,
		},

		// Unique login identifier.
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},

		// Hashed password should be stored here (never plain text).
		password: {
			type: String,
			required: true,
		},

		// Indicates whether email/account verification is completed.
		verified: {
			type: Boolean,
			default: false,
		},
		lastEmailSentAt: {
			type: Date,
			default: null,
		},
	},
	{
		// Adds createdAt and updatedAt automatically.
		timestamps: true,
	}
);


// Hash password before saving when it is newly set or changed.
userSchema.pre("save", async function () {
	if (!this.isModified("password")) {
		return ;
	}

	this.password = await bcrypt.hash(this.password, 10);
	
});

userSchema.methods.comparePassword = function(plainPassword) {
	return bcrypt.compare(plainPassword, this.password);
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
