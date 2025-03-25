const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    voucherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
    },
    type: {
      type: String,
      enum: ["purchase", "redeem"],
      required: true,
    },
    date: {
      type: Date,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Transaction", transactionSchema);
