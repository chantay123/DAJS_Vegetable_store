const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema(
    {
        prod_id: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        max_quantity: {
            type: Number,
        },
        reserved_quantity: {
            type: Number,
            default: 0,
        },
        available_quantity: {
            type: Number,
            default: 0,
        },
        isDeleted: {
            type: Boolean,
            default: false, // Mặc định là chưa bị xóa
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Stock", StockSchema);
