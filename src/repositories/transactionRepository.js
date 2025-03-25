const BaseRepository = require("./baseRepository");
const Transaction = require("../models/transaction");

class TransactionRepository extends BaseRepository {
  constructor() {
    super(Transaction);
  }

  async getUserTransactions(userId, page = 1, limit = 10) {
    return await this.findWithPagination({ user: userId }, page, limit, {
      createdAt: -1,
    });
  }
}

module.exports = TransactionRepository;
