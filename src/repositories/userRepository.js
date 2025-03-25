const BaseRepository = require("./baseRepository");
const User = require("../models/user");

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.model.findOne({ email });
  }

  async updateBalance(userId, amount) {
    return await this.model.findByIdAndUpdate(
      userId,
      { $inc: { balance: amount } },
      { new: true }
    );
  }
}

module.exports = UserRepository;
