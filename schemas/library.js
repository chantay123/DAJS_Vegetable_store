let mongoose = require("mongoose");
const LibrarySchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    prod_id: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Library", LibrarySchema);
