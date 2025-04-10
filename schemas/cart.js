let mongoose = require("mongoose");
const CartSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                product_id: {
                    type: mongoose.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
        total_price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Cart", CartSchema);
