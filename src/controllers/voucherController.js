const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const VoucherService = require("../services/voucherService");

class VoucherController {
  constructor() {
    this.voucherService = new VoucherService();
  }

  createVoucher = asyncHandler(async (req, res, next) => {
    const voucher = await this.voucherService.createVoucher({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      status: "success",
      data: voucher,
    });
  });

  getVouchers = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, status } = req.query;
    const filter = status ? { status } : {};

    const vouchers = await this.voucherService.getVouchers(
      filter,
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json({
      status: "success",
      data: vouchers,
    });
  });

  getVoucher = asyncHandler(async (req, res, next) => {
    const voucher = await this.voucherService.getVoucherById(req.params.id);

    res.status(200).json({
      status: "success",
      data: voucher,
    });
  });

  updateVoucher = asyncHandler(async (req, res, next) => {
    const voucher = await this.voucherService.updateVoucher(
      req.params.id,
      req.body,
      req.user.id
    );

    res.status(200).json({
      status: "success",
      data: voucher,
    });
  });

  deleteVoucher = asyncHandler(async (req, res, next) => {
    await this.voucherService.deleteVoucher(req.params.id);
    res.status(204).end();
  });

  purchaseVoucher = asyncHandler(async (req, res, next) => {
    const voucher = await this.voucherService.purchaseVoucher(
      req.user.id,
      req.params.voucherId
    );

    res.status(200).json({
      status: "success",
      message: "Voucher purchased successfully",
      data: voucher,
    });
  });

  redeemVoucher = asyncHandler(async (req, res, next) => {
    await this.voucherService.redeemVoucher(req.user.id, req.params.voucherId);

    res.status(200).json({
      status: "success",
      message: "Voucher redeemed successfully",
    });
  });
}

module.exports = VoucherController;
