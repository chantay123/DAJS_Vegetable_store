const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
    {
        stock_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Stock",
            required: true,
        },
        supplier_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true,
        },
        quantity_change: {
            type: Number,
            required: true,
        },
        movement_date: {
            type: Date,
            required: true,
        },
        is_deleted: {
            type: Boolean,
            default: false, // Mặc định là chưa bị xóa
        },
    },
    {
        timestamps: true,
    }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
