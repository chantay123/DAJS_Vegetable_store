const mongoose = require('mongoose');

const productAttributeSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    weight: { type: Number, default: 0 },
    original_price: { type: Number, default: 0 },
    discount_price: { type: Number, default: 0 },
    discount_percent: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    color: { type: String, default: '' },
    is_deleted: { type: Boolean, default: false }
}, {
    timestamps: true,
});

module.exports = mongoose.model('ProductAttribute', productAttributeSchema);