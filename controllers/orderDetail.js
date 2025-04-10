let orderdetailModel = require("../schemas/orderDetail");
let orderModel = require("../schemas/order");
let userModel = require("../schemas/user");
let productModel = require("../schemas/products");
const { GetOrdersByUserId, DeleteAnOrder } = require("./orders");

module.exports = {

   GetAllOrderDetails: async function () {
      return await orderdetailModel.find({ is_deleted: false });
   },
   GetOrderDetailById: async function (id) {
      return await orderdetailModel.findById({ _id: id, is_deleted: false });
   },
   GetOrderDetailsByOrderId: async function (orderId) {
      try {
         let Order = await orderModel.findById(orderId);
         if (Order) {
            return await orderdetailModel.find({ order: Order, is_deleted: false });
         }
         else {
            throw new Error("Khong tim thay order");
         }
      } catch (e) {
         throw new Error(e.message);
      }
   },
   GetOrderDetailsByUserId: async function (userId) {
      try {
         console.log(userId);
         User = await userModel.findById(userId);
         console.log(User);
         if (User) {
            return await orderdetailModel.find({ user: User, is_deleted: false });
         } else {
            throw new Error("Khong tim thay user");
         }
      } catch (error) {
         throw new Error(error.message);
      }
   },
   GetOrderDetailsByProductId: async function (productId) {
      try {
         let Product = await productModel.findById(productId);
         if (Product) {
            return await orderdetailModel.find({ product: Product, is_deleted: false });
         } else {
            throw new Error("Khong tim thay product");
         }
      } catch (error) {
         throw new Error(error.message);
      }
   },

   CreateAnOrderDetail: async function (orderId, userId, productId, product_attributeId, quantity, price) {
      try {
         let order = await orderModel.findById(orderId);
         let user = await userModel.findById(userId);
         let product = await productModel.findById(productId);

         if (order && user && product) {
            let orderDetail = new orderdetailModel({
               order: orderId,
               user: userId,
               product: productId,
               product_attribute: product_attributeId,
               quantity: quantity,
               price: price
            });
            return await orderDetail.save();
         }
         else {
            throw new Error("Khong ton tai order nay");
         }
      } catch (error) {
         throw new Error(error.message);
      }
   },

   UpdateAnOrderDetail: async function (id, body) {
      try {
         let orderDetail = await orderdetailModel.findById(id);
         if (orderDetail) {
            const allowedFields = ["quantity", "price"];
            for (const field of allowedFields) {
               if (body[field] !== undefined) { // Kiểm tra xem field có được gửi không
                  orderDetail[field] = body[field];
               }
            }
            return await orderDetail.save();
         } else {
            throw new Error("Khong tim thay order detail");
         }
      } catch (error) {
         throw new Error(error.message);
      }
   },

   DeleteAnOrderDetail: async function (id) {
      try {
         return await orderdetailModel.findByIdAndUpdate(
            id, {
            is_deleted: true
         })
      } catch (error) {
         throw new Error(error.message);
      }
   },
}