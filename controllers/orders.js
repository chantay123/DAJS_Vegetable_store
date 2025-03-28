let orderModel = require("../schemas/order");
let userModel = require("../schemas/user");

module.exports = {
   GetAllOrders: async function () {
      return await orderModel.find({ isDeleted: false });
   },
   GetOrderById: async function (id) {
      return await orderModel.findById({ _id: id, isDeleted: false });
   },
   GetOrdersByUserId: async function (userId) {
      try {
         User = await userModel.findById(userId);
         if (User) {
            return await orderModel.find({ user: User, isDeleted: false });
         } else {
            throw new Error("Khong tim thay user");
         }
      } catch (error) {
         throw new Error(error.message);
      }
   },
   CreateAnOrder: async function (userId, payment_method, address, note, total_price) {
      try {
         let user = await userModel.findById(userId);
         if(user){
            let order = new orderModel({
               user: userId,
               payment_method: payment_method,
               address: address,
               note: note,
               total_price: total_price
            });
            return await order.save();
         }
         else{
            throw new Error("Khong ton tai user nay");
         }
      } catch (error) {
         throw new Error(error.message);
      }
   },
   // UpdateAnOrder: async function (id, payment_method, address, status, note, total_price) {
   //    try {
   //       let order = await orderModel.findById(id);
   //       if(order){
   //          order.payment_method = payment_method;
   //          order.address = address;
   //          order.status = status;
   //          order.note = note;
   //          order.total_price = total_price;
   //          return await order.save();
   //       }
   //       else{
   //          throw new Error("Khong tim thay order");
   //       }
   //    } catch (error) {
   //       throw new Error(error.message);
   //    }
   // },
   UpdateAnOrder: async function (id, body) {
      try {
         let order = await orderModel.findById(id);
         if (order) {
            const allowedFields = ["payment_method", "address", "status", "note", "total_price"];

            // Chỉ cập nhật các trường được gửi trong updates và nằm trong allowedFields
            for (const field of allowedFields) {
               if (body[field] !== undefined) { // Kiểm tra xem field có được gửi không
                  order[field] = body[field];
               }
            }
            return await order.save();
         }  
         else{
            throw new Error("Khong tim thay order");
         }
      } catch (error) {
         throw new Error(error.message);
      }
   },
   DeleteAnOrder: async function (id) {
      try {
         return await orderModel.findByIdAndUpdate(
                         id, {
                         isDeleted: true
                     })
      } catch (error) {
         throw new Error(error.message);
      }
   },
}