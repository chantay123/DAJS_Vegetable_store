var cartModel = require("../schemas/cart");
var userModel = require("../schemas/user");
var productModel = require("../schemas/products");
module.exports = {
    // 1. Lấy tất cả cart
    GetAllCart: async function () {
        return await cartModel
            .find()
            .populate("user")
            .populate("items.product");
    },

    // 2. Lấy cart theo ID
    GetCartById: async function (id) {
        return await cartModel
            .findById(id)
            .populate("user")
            .populate("items.product");
    },

    // 3. Lấy tất cả cart theo user
    GetCartByUsername: async function (username) {
        let user = await userModel.findOne({
            username: username,
        });
        let cart = await cartModel
            .findOne({ user: user._id })
            .populate("items.product");
        return cart;
    },
    // 4. Lấy cart theo userId
    GetCartByUserId: async function (userId) {
        return await cartModel
            .findOne({ user: userId })
            .populate("items.product_id")
            .populate("user");
    },
    // 5. Tạo cart mới
    CreateACart: async function (data, user) {
        try {
            // Tính tổng giá từ các sản phẩm
            let total = 0;
            for (const item of data.items) {
                const product = await productModel.findById(item.product_id);
                if (!product) throw new Error("Product not found");
                total += item.quantity * product.sold;
            }

            const newCart = new cartModel({
                user: user._id,
                items: data.items,
                total_price: total,
            });

            return await newCart.save();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // 6. Cập nhật cart
    UpdateACart: async function (id, data) {
        try {
            let cart = await cartModel.findById(id);
            if (!cart) {
                throw new Error("Cart not found");
            }
            cart.items = data.items;
            let total = 0;
            for (const item of cart.items) {
                const product = await productModel.findById(item.product_id);
                if (!product) throw new Error("Product not found");
                total += item.quantity * (product.sold || 0);
            }

            cart.total_price = total;
            return await cart.save();
        } catch (error) {
            throw new Error(error.message);
        }
    },
    // 7. Xoá cart theo ID
    DeleteACart: async function (id) {
        try {
            const cart = await cartModel.findById(id);
            if (!cart) {
                throw new Error("Cart not found");
            }
            return await cart.deleteOne();
        } catch (error) {
            throw new Error(error.message);
        }
    },
};
