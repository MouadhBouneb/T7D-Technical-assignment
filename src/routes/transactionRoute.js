const express = require("express");
const TransactionController = require("../controllers/transactionController");
const auth = require("../middlewares/auth");
const {
  validateRequest,
  transactionValidation,
} = require("../middlewares/validation");
const router = express.Router();
const transactionController = new TransactionController();

// Admin routes
router.use(auth.protect);
router.get(
  "/",
  auth.restrictTo("admin"),
  transactionController.getTransactions
);

module.exports = router;
