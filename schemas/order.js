let mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    payment_method: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      default: "pending",
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    total_price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    order_date: {
      type: Date,
      default: Date.now,
    },
    isDeleted:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("order", OrderSchema);
