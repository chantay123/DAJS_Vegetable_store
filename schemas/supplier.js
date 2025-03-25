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
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    website: {
      type: String,
    },
    certification_details: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("supplier", SupplierSchema);
