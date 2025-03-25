const BaseRepository = require("./baseRepository");
const Voucher = require("../models/voucher");

class VoucherRepository extends BaseRepository {
  constructor() {
    super(Voucher);
  }

  async findByCode(code) {
    return await this.findOne({ code });
  }

  async findActiveVouchers() {
    return await this.findAll({
      status: "active",
      expiryDate: { $gt: new Date() },
    });
  }

  async expireOldVouchers() {
    return await this.model.updateMany(
      {
        expiryDate: { $lt: new Date() },
        status: { $ne: "expired" },
      },
      {
        status: "expired",
      }
    );
  }
}

module.exports = VoucherRepository;
