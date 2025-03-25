let mongoose = require("mongoose");
const TransactionHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Types.ObjectId, ref: "Order" },
    action: { type: String, required: true },
    amount: { type: Number },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
module.exports = mongoose.model("transactionhistory", TransactionHistorySchema);
