const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a voucher name"],
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    value: {
      type: Number,
      required: [true, "Please provide voucher value"],
      min: [1, "Voucher value must be at least 1"],
    },
    status: {
      type: String,
      enum: ["active", "redeemed", "expired"],
      default: "active",
    },
    expiryDate: {
      type: Date,
      required: [true, "Please provide expiry date"],
      validate: {
        validator: function (value) {
          return value > Date.now();
        },
        message: "Expiry date must be in the future",
      },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

voucherSchema.index({ createdAt: 1 });
voucherSchema.index({ status: 1 });
voucherSchema.index({ expiryDate: 1 });

module.exports = mongoose.model("Voucher", voucherSchema);
