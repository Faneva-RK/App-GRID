const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("task-service connected to MongoDB");
  } catch (error) {
    console.error("task-service MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

