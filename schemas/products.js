let mongoose = require("mongoose");
let productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    slug: {
      type: String,
      default: 0,
      default: "",
    },
    origin: {
      type: String,
      default: "",
    },
    sold: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      default: "",
    },
    urlImg: {
      type: String,
      default: "",
    },
    images: { type: [String] },
    is_active: {
      type: Boolean,
      default: true,
    },
    hot: { type: Boolean, default: false },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    supplier: {
      type: mongoose.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("product", productSchema);
