var express = require("express");
var router = express.Router();
let orderController = require("../controllers/orders");
let {check_authentication, check_authorization} = require("../utils/check_auth");
 let { CreateSuccessRes } = require("../utils/responseHandler");
 let constants = require("../utils/constants");

 // Lay tat ca order
router.get(
   "/",
   check_authentication,
   check_authorization(constants.MOD_PERMISSION),
   async function (req, res, next) {
   try {
      let orders = await orderController.GetAllOrders();
      CreateSuccessRes(res, orders, 200);
   } catch (error) {
      next(error);
   }
   }
);

// Lay order theo user id
router.get(
   "/user",
   check_authentication,
   check_authorization(constants.USER_PERMISSION),
   async function (req, res, next) {
      try {
         let orders = await orderController.GetOrdersByUserId(req.user._id);
         if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "Khong tim thay order cua user" });
         }
         CreateSuccessRes(res, orders, 200);
      } catch (error) {
         next(error);
      }
   }
);

// Lay order theo id
router.get(
   "/:id",
   check_authentication,
   check_authorization(constants.USER_PERMISSION),
   async function (req, res, next) {
   try {
      let order = await orderController.GetOrderById(req.params.id);
      CreateSuccessRes(res, order, 200);
   } catch (error) {
      next(error);
   }
   }
);

// Tao order
router.post(
   "/",
   check_authentication,
   check_authorization(constants.USER_PERMISSION),
   async function (req, res, next) {
   try {
      let body = req.body;
      console.log(body);
      let order = await orderController.CreateAnOrder(
         req.user._id,
         body.payment_method,
         body.address,
         body.note,
         body.total_price
      );
      CreateSuccessRes(res, order, 200);
   } catch (error) {
      next(error);
   }
   }
);

// Cap nhat order 
router.put(
   "/:id",
   check_authentication,
   check_authorization(constants.MOD_PERMISSION),
   async function (req, res, next) {
   try {
      let body = req.body;
      let order = await orderController.UpdateAnOrder(
         req.params.id,
         body);
      CreateSuccessRes(res, order, 200);
   } catch (error) {
      next(error);
   }
   }
);

// Xoa order
router.delete(
   "/:id",
   check_authentication,
   check_authorization(constants.ADMIN_PERMISSION),
   async function (req, res, next) {
   try {
      let order = await orderController.DeleteAnOrder(req.params.id);
      CreateSuccessRes(res, order, 200);
   } catch (error) {
      next(error);
   }
   }
);
module.exports = router;