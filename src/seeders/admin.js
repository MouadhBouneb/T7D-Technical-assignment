const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "./.env" });

// Admin user data
const adminUsers = [
  {
    name: "Super Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
];

const seedAdminUsers = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected for seeding...");

    // Delete existing admin users (optional)
    await User.deleteMany({ role: "admin" });
    console.log("Existing admin users removed");

    // Hash passwords and create users
    const createdUsers = await Promise.all(
      adminUsers.map(async (user) => {
        return User.create({
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
        });
      })
    );

    console.log(`${createdUsers.length} admin users created:`);
    createdUsers.forEach((user) => {
      console.log(`- ${user.name} (${user.email})`);
    });

    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedAdminUsers();
