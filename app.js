const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./.env" });

// Connect to database
const connectDB = require("./src/config/db");
connectDB();
// Route files
const authRoutes = require("./src/routes/authRoute");
const voucherRoutes = require("./src/routes/voucherRoute");
const transactionRoutes = require("./src/routes/transactionRoute");

// Initialize express
const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/transaction", transactionRoutes);

// Error handler middleware
const errorHandler = require("./src/middlewares/errorHandler");
app.use(errorHandler);
// cron for exipred Voucher
const CronService = require("./src/services/cronService");
new CronService();
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
