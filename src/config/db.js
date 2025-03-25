const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    // Connection event listeners
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error(`Mongoose connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });

    return mongoose;
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
