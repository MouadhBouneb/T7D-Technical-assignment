const VoucherRepository = require("../repositories/VoucherRepository");
const TransactionRepository = require("../repositories/TransactionRepository");
const UserRepository = require("../repositories/UserRepository");
const AppError = require("../utils/AppError");
const generateCode = require("../utils/generateCode");
const { default: mongoose } = require("mongoose");

class VoucherService {
  constructor() {
    this.voucherRepo = new VoucherRepository();
    this.transactionRepo = new TransactionRepository();
    this.userRepo = new UserRepository();
  }

  async createVoucher(voucherData) {
    // Generate unique voucher code
    const code = generateCode(8);

    // Create voucher
    const voucher = await this.voucherRepo.create({
      ...voucherData,
      code,
      createdBy: voucherData.createdBy,
    });

    return voucher;
  }

  async getVouchers(filter = {}, page = 1, limit = 10) {
    return await this.voucherRepo.findWithPagination(filter, page, limit);
  }

  async getVoucherById(id) {
    const voucher = await this.voucherRepo.findById(id);
    if (!voucher) {
      throw new AppError("Voucher not found", 404);
    }
    return voucher;
  }

  async updateVoucher(id, updateData, updatedBy) {
    const voucher = await this.voucherRepo.update(id, {
      ...updateData,
      updatedBy,
    });

    if (!voucher) {
      throw new AppError("Voucher not found", 404);
    }

    return voucher;
  }

  async deleteVoucher(id) {
    const voucher = await this.voucherRepo.delete(id);
    console.log("voucher", voucher);
    if (!voucher) {
      throw new AppError("Voucher not found", 404);
    }
    return voucher;
  }

  async purchaseVoucher(userId, voucherId) {
    // Get user and voucher
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    const voucher = await this.voucherRepo.findById(voucherId);
    if (!voucher) throw new AppError("Voucher not found", 404);

    const transaction = await this.transactionRepo.findOne({
      voucherId: voucherId,
    });
    console.log("transaction", transaction);
    if (transaction) throw new AppError("Voucher purchased", 400);

    // Check voucher status
    if (voucher.status !== "active") {
      throw new AppError("Voucher is not available for purchase", 400);
    }

    if (voucher.expiryDate < new Date()) {
      throw new AppError("Voucher has expired", 400);
    }

    // Check user balance
    if (user.balance < voucher.value) {
      throw new AppError("Insufficient balance", 400);
    }

    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Deduct from user balance
      await this.userRepo.updateBalance(userId, -voucher.value);

      // Create transaction record
      await this.transactionRepo.create({
        userId: userId,
        voucherId: voucherId,
        type: "purchase",
        date: Date.now(),
      });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    return voucher;
  }

  async redeemVoucher(userId, voucherId) {
    // Get user and voucher
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    const voucher = await this.voucherRepo.findById(voucherId);
    if (!voucher) throw new AppError("Voucher not found", 404);

    const transaction = await this.transactionRepo.findOne({
      voucherId: voucherId,
    });

    // Check voucher status
    if (!transaction) {
      throw new AppError("Voucher is not available for redemption", 400);
    }

    if (voucher.expiryDate < new Date()) {
      throw new AppError("Voucher has expired", 400);
    }

    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update voucher status
      await this.voucherRepo.update(voucherId, {
        status: "redeemed",
      });

      // Add to user balance
      await this.userRepo.updateBalance(userId, voucher.value);

      // Create transaction record
      await this.transactionRepo.create({
        userId: userId,
        voucherId: voucherId,
        type: "redeem",
        date: Date.now(),
      });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    return { success: true };
  }
}

module.exports = VoucherService;
