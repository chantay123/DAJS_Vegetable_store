var express = require("express");
var router = express.Router();
let orderdetailController = require("../controllers/orderDetail");
let { check_authentication, check_authorization } = require("../utils/check_auth");
let { CreateSuccessRes } = require("../utils/responseHandler");
let constants = require("../utils/constants");

// lấy tất cả order detail
router.get(
   "/",
   check_authentication,
   check_authorization(constants.MOD_PERMISSION),
   async function (req, res, next) {
      try {
         let orderDetails = await orderdetailController.GetAllOrderDetails();
         CreateSuccessRes(res, orderDetails, 200);
      } catch (error) {
         next(error);
      }
   }
);
// lấy order detail theo id
router.get(
   "/:id",
   check_authentication,
   check_authorization(constants.MOD_PERMISSION),
   async function (req, res, next) {
      try {
         let orderdetail = await orderdetailController.GetOrderDetailById(req.params.id);
         CreateSuccessRes(res, orderdetail, 200);
      } catch (error) {
         next(error);
      }
   }
);
// lấy order detail theo user id
router.get(
   "/user",
   check_authentication,
   check_authorization(constants.USER_PERMISSION),
   async function (req, res, next) {
      try {
         let orderDetails = await orderdetailController.GetOrderDetailsByUserId(req.user._id);
         CreateSuccessRes(res, orderDetails, 200);
      } catch (error) {
         next(error);
      }
   }
);
// lấy order detail theo order id
router.get(
   "/order/:id",
   check_authentication,
   check_authorization(constants.USER_PERMISSION),
   async function (req, res, next) {
      try {
         let orderDetails = await orderdetailController.GetOrderDetailsByOrderId(req.params.id);
         CreateSuccessRes(res, orderDetails, 200);
      } catch (error) {
         next(error);
      }
   }
);
// lấy order detail theo product id
router.get(
   "/product/:id",
   check_authentication,
   check_authorization(constants.MOD_PERMISSION),
   async function (req, res, next) {
      try {
         let orderDetails = await orderdetailController.GetOrderDetailsByProductId(req.params.id);
         CreateSuccessRes(res, orderDetails, 200);
      } catch (error) {
         next(error);
      }
   }
);

// tạo order detail
router.post(
   "/",
   check_authentication,
   check_authorization(constants.USER_PERMISSION),
   async function (req, res, next) {
      try {
         let body = req.body;
         let orderdetail = await orderdetailController.CreateAnOrderDetail(
            req.user._id,
            body.orderId,
            body.productId,
            body.product_attributeId,
            body.quantity,
            body.price
         );
         CreateSuccessRes(res, orderdetail, 200);
      } catch (error) {
         next(error);
      }
   }
);

module.exports = router;