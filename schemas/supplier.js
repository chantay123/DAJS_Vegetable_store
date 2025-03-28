let mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema(
  {
    company_name: {
      type: String,
      required: true,
    },
    contact_name: {
      type: String,
      default: "",
    },
    contact_title: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      unique: true,
      default: "",
    },
    email: {
      type: String,
      unique: true,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    certification_details: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("supplier", SupplierSchema);
