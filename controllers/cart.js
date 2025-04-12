var cartModel = require("../schemas/cart");
var userModel = require("../schemas/user");
var productModel = require("../schemas/products");
const { default: mongoose } = require("mongoose");
module.exports = {
  // 1. Lấy tất cả cart
  GetAllCart: async function () {
    return await cartModel
      .find()
      .populate("user")
      .populate({
        path: "items.product_id",
        select: "name description origin sold thumbnail_url supplier category",
        populate: {
          path: "productAttributes",
          select:
            "weight original_price discount_price discount_percent quantity color",
        },
      });
  },

  // 2. Lấy cart theo ID
  GetCartById: async function (id) {
    return await cartModel
      .findById(id)
      .populate("user")
      .populate({
        path: "items.product_id",
        select: "name description origin sold thumbnail_url supplier category",
        populate: {
          path: "productAttributes",
          select:
            "weight original_price discount_price discount_percent quantity color",
        },
      });
  },

  // 3. Lấy tất cả cart theo user
  GetCartByUsername: async function (username) {
    let user = await userModel.findOne({
      username: username,
    });
    let cart = await cartModel.findOne({ user: user._id }).populate({
      path: "items.product_id",
      select: "name description origin sold thumbnail_url supplier category",
      populate: {
        path: "productAttributes",
        select:
          "weight original_price discount_price discount_percent quantity color",
      },
    });
    return cart;
  },
  // 4. Lấy cart theo userId
  GetCartByUserId: async function (userId) {
    return await cartModel
      .findOne({ user: userId })
      .populate("user")
      .populate({
        path: "items.product_id",
        select: "name description origin sold thumbnail_url supplier category",
        populate: {
          path: "productAttributes",
          select:
            "weight original_price discount_price discount_percent quantity color",
        },
      });
  },
  // 5. Tạo cart mới
  CreateACart: async function (data, user) {
    try {
      // Tính tổng giá ban đầu
      let total = 0;

      // Lấy user
      user = await userModel.findById(user);
      if (!user) throw new Error("User not found");

      // Tìm giỏ hàng của user
      let cart = await cartModel.findOne({ user: user._id });

      if (!cart) {
        // Nếu chưa có giỏ → tạo mới
        const itemsWithProduct = [];

        for (const item of data.items) {
          const product = await productModel.findById(item.product_id);
          if (!product) continue;

          total += item.quantity * (product.sold || 0);

          itemsWithProduct.push({
            product_id: product._id,
            quantity: item.quantity,
          });
        }

        cart = new cartModel({
          user: user._id,
          items: itemsWithProduct,
          total_price: total,
        });
      } else {
        // Nếu đã có giỏ → cập nhật sản phẩm
        for (const newItem of data.items) {
          const product = await productModel.findById(newItem.product_id);
          if (!product) continue;

          const index = cart.items.findIndex(
            (i) => i.product_id.toString() === newItem.product_id
          );

          if (index !== -1) {
            // Đã có sản phẩm trong giỏ → cộng quantity
            cart.items[index].quantity += newItem.quantity;
          } else {
            // Chưa có → thêm mới
            cart.items.push({
              product_id: product._id,
              quantity: newItem.quantity,
            });
          }
        }

        // Tính lại tổng giá
        total = 0;
        for (const item of cart.items) {
          const product = await productModel.findById(item.product_id);
          if (product) {
            total += item.quantity * (product.sold || 0);
          }
        }

        cart.total_price = total;
      }

      // Lưu giỏ hàng và populate dữ liệu trả về
      const result = await cart.save();
      const populatedCart = await result.populate({
        path: "items.product_id",
        select: "name description origin sold thumbnail_url supplier category",
        populate: {
          path: "productAttributes",
          select:
            "weight original_price discount_price discount_percent quantity color",
        },
      });

      return populatedCart;
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
      let result = await cart.save();
      return result.populate({
        path: "items.product_id",
        select: "name description origin sold thumbnail_url supplier category",
        populate: {
          path: "productAttributes",
          select:
            "weight original_price discount_price discount_percent quantity color",
        },
      });
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

  DeleteProCart: async function (id, pro_id) {
    try {
      const cart = await cartModel.findById(id);
      if (!cart) {
        throw new Error("Cart not found");
      }
  
      const product = await productModel.findOne({
        _id: pro_id.product_id,
        is_deleted: false,
      });
      if (!product) {
        throw new Error("Product đâu?");
      }
  
      await cartModel.findByIdAndUpdate(
        { _id: id },
        {
          $pull: {
            items: {
              product_id: new  mongoose.Types.ObjectId(pro_id.product_id),
            },
          },
        },
        { new: true }
      );
  
      // ✅ Lấy lại cart sau khi xóa
      const updatedCart = await cartModel.findById(id).populate({
        path: "items.product_id",
        select: "name description origin sold thumbnail_url supplier category",
        populate: {
          path: "productAttributes",
          select:
            "weight original_price discount_price discount_percent quantity color",
        },
      });
  
      return updatedCart;
    } catch (error) {
      throw new Error(error.message);
    }
  }  
};
