import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (mongoose.connections[0].readyState === 1) return;

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to mongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
}
