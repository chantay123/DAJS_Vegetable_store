var productAttributeModel = require('../schemas/productAttribute');
let productModel = require('../schemas/products');

module.exports = {
    getProductAttribute: async (prod_id) => {
        try {
            let product = await productModel.findOne({ _id: prod_id, is_deleted: false });
            let product_attribute = await productAttributeModel
                .findOne({ product_id: product._id })
                .populate({
                    path: 'product_id', select: 'name slug origin supplier category',
                    populate: {
                        path: 'category', // Populate thông tin từ bảng category
                        select: 'name' // Chỉ lấy các trường cần thiết
                    }
                });
            return product_attribute;
        } catch (error) {
            throw new Error(error.message)
        }
    },

    CreateNewProductAttribute: async (prod_id) => {
        try {
            console.log(prod_id);
            product = await productModel.findOne({
                _id: prod_id,
                is_deleted: false
            })
            if (product) {
                let newProductAttribute = new productAttributeModel({
                    product_id: product._id, // Đảm bảo đây là ObjectId hợp lệ của Product
                    // weight: body.weight || 0,
                    // original_price: body.original_price || 0,
                    // discount_price: body.discount_price || 0,
                    // discount_percent: body.discount_percent || 0,
                    // quantity: body.quantity || 0,
                    // color: body.color || ''
                });
                await newProductAttribute.save();
                return newProductAttribute;
            }
            else {
                throw new Error("khong tim thay product")
            }
        } catch (error) {
            throw new Error(error.message)
        }
    },

    ModifyProductAttribute: async (prod_id, body) => {
        try {
            let product = await productModel.findOne({ _id: prod_id, is_deleted: false });
            if (product) {
                product_attribute = await productAttributeModel.findOne({ product_id: product._id });
                if (!product_attribute) {
                    throw new Error("khong tim thay product attribute")
                }
                if (body.weight) {
                    product_attribute.weight = body.weight;
                }
                if (body.original_price) {
                    product_attribute.original_price = body.original_price;
                }
                if (body.discount_price) {
                    product_attribute.discount_price = body.discount_price;
                }
                if (body.discount_percent) {
                    product_attribute.discount_percent = body.discount_percent;
                }
                if (body.quantity) {
                    product_attribute.quantity = body.quantity;
                }
                if (body.color) {
                    product_attribute.color = body.color;
                }
                return await product_attribute.save();
            }
            else {
                throw new Error("khong tim thay product")
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }
}