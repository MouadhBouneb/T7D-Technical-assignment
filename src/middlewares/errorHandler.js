const AppError = require("../utils/AppError");

const developmentErrorHandler = (err, req, res, next) => {
  // Set default status code and status if not set
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Handle specific error types with cleaner messages
  if (err.name === "CastError") {
    err.message = `Invalid value: ${err.value} for field: ${err.path}`;
    err.statusCode = 400;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err.message = `Duplicate field value: ${err.keyValue[field]}. Please use another value!`;
    err.statusCode = 400;
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    err.message = `Validation error: ${errors.join(". ")}`;
    err.statusCode = 400;
  }

  if (err.name === "JsonWebTokenError") {
    err.message = "Invalid authentication token";
    err.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    err.message = "Your authentication token has expired. Please log in again.";
    err.statusCode = 401;
  }

  // Log the full error to console for debugging
  console.error("❌ Error:", {
    message: err.message,
    statusCode: err.statusCode,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    ...(err.errors && { errors: err.errors }),
  });

  // Send response to client
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && {
      error: err,
      stack: err.stack,
    }),
  });
};

module.exports = developmentErrorHandler;
