import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
	{
		// Owner of this chat thread.
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},

		// Human-readable title for the chat.
		title: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		// Adds createdAt and updatedAt automatically.
		timestamps: true,
	}
);

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;
