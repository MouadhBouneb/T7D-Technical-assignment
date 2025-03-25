const TransactionRepository = require("../repositories/TransactionRepository");

class transactionService {
  constructor() {
    this.transactionRepo = new TransactionRepository();
  }

  async getTransactions(filter = {}, page = 1, limit = 10) {
    return await this.transactionRepo.findWithPagination(filter, page, limit);
  }
}

module.exports = transactionService;
