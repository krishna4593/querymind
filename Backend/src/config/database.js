import mongoose from "mongoose";

// Creates and verifies a single MongoDB connection for the app.
const connectDatabase = async () => {
  const { MONGO_URI } = process.env;

  // Fail fast with a clear message if the URI is missing.
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }

  // Mongoose handles the connection pool internally.
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected successfully.");
};

export default connectDatabase;
