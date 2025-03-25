const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const transactionService = require("../services/transactionService");

class TransactionController {
  constructor() {
    this.transactionService = new transactionService();
  }

  getTransactions = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, status } = req.query;
    const filter = status ? { status } : {};

    const transactions = await this.transactionService.getTransactions(
      filter,
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json({
      status: "success",
      data: transactions,
    });
  });
}

module.exports = TransactionController;
