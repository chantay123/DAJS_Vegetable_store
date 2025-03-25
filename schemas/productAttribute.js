let mongoose = require("mongoose");
const ProductAttributeSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
    weight: {
      type: Number,
    },
    original_price: {
      type: Number,
      required: true,
    },
    discounted_percent: {
      type: Number,
      default: 0,
    },
    discounted_price: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("productatribute", ProductAttributeSchema);
