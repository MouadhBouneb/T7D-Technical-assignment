const express = require("express");
const VoucherController = require("../controllers/voucherController");
const auth = require("../middlewares/auth");
const {
  validateRequest,
  voucherValidation,
} = require("../middlewares/validation");
const router = express.Router();
const voucherController = new VoucherController();

// Public routes
router.get("/", voucherController.getVouchers);

// Admin routes
router.use(auth.protect);
router.get("/:id", voucherController.getVoucher);
router.post(
  "/",
  auth.restrictTo("admin"),
  validateRequest(voucherValidation.create),
  voucherController.createVoucher
);
router.put(
  "/:id",
  auth.restrictTo("admin"),
  validateRequest(voucherValidation.update),
  voucherController.updateVoucher
);
router.delete(
  "/:id",
  auth.restrictTo("admin"),
  voucherController.deleteVoucher
);

// User routes
router.post(
  "/:voucherId/purchase",
  auth.restrictTo("user"),
  voucherController.purchaseVoucher
);
router.post(
  "/:voucherId/redeem",
  auth.restrictTo("user"),
  voucherController.redeemVoucher
);

module.exports = router;
