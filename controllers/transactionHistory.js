let transHistoryModel = require("../schemas/transactionHistory");
let userModel = require("../schemas/user");
let orderModel = require("../schemas/order");

module.exports = {

   GetAllTransactionHistory: async function () {
      return await transHistoryModel.find({ isDeleted: false });
   },
   GetTransactionHistoryById: async function (id) {
      return await transHistoryModel.findById({ _id: id, isDeleted: false });
   },
   GetTransactionHistoryByUserId: async function (userId) {
      try {
         User = await userModel.findById(userId);
         if (User) {
            return await transHistoryModel.find({ user: User, isDeleted: false });
         } else {
            throw new Error("Khong tim thay user");
         }
      } catch (error) {
         throw new Error(error.message);
      }
   },
   GetAllTransactionHistoryByOrderId: async function (orderId) {
      try {
         Order = await orderModel.findById(orderId);
         if (Order) {
            return await transHistoryModel.find({ order: Order, isDeleted: false });
         } else {
            throw new Error("Khong tim thay order");
         }
      } catch (error) {
         throw new Error(error.message);
      }
   },

   CreateATransactionHistory: async function (userId, orderId, action, amount) {
      try {
         let user = await userModel.findById(userId);
         let order = await orderModel.findById(orderId);
         if (user && order) {
            let transactionHistory = new transHistoryModel({
               user: userId,
               order: orderId,
               action: action,
               amount: amount
            });
            return await transactionHistory.save();
         } else {
            throw new Error("Khong ton tai user và order nay");
         }
      } catch (error) {
         throw new Error(error.message);
      }
   },

   UpdateTransactionHistory: async function (id, body) {
      try {
         let transactionHistory = await transHistoryModel.findById(id);
         if (transactionHistory) {
            const allowedFields = ["action", "amount", "timestamp"];

            // Chỉ cập nhật các trường được gửi trong updates và nằm trong allowedFields
            for (const field of allowedFields) {
               if (body[field] !== undefined) { // Kiểm tra xem field có được gửi không
                  transactionHistory[field] = body[field];
               }
            }
            return await transactionHistory.save();
         }
         else {
            throw new Error("Khong tim thay transactionHistory");
         }
      } catch (error) {
         throw new Error(error.message);
      }
   },

   DeleteTransactionHistory: async function (id) {
      try {
         let transactionHistory = await transHistoryModel.findById(id);
         if (transactionHistory) {
            transactionHistory.isDeleted = true;
            return await transactionHistory.save();
         } else {
            throw new Error("Khong tim thay transactionHistory");
         }
      } catch (error) {
         throw new Error(error.message);
      }
   }
}