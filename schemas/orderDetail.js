let mongoose = require("mongoose");

const OrderDetailSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Types.ObjectId, ref: "Order", required: true },
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
    product_attribute: {
      type: mongoose.Types.ObjectId,
      ref: "ProductAttribute",
    },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    is_deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderDetail", OrderDetailSchema);
