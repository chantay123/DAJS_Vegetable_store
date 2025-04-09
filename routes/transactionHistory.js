var express = require("express");
var router = express.Router();
let transactionHistory = require("../controllers/transactionHistory");
let { check_authentication, check_authorization } = require("../utils/check_auth");
let { CreateSuccessRes } = require("../utils/responseHandler");
let constants = require("../utils/constants");

// lay tat ca transactionHistory
router.get(
   "/",
   check_authentication,
   check_authorization(constants.MOD_PERMISSION),
   async function (req, res, next) {
      try {
         let transactionHistorys = await transactionHistory.GetAllTransactionHistory();
         CreateSuccessRes(res, transactionHistorys, 200);
      } catch (error) {
         next(error);
      }
   }
);
// lay transactionHistory theo user id
router.get(
   "/user",
   check_authentication,
   check_authorization(constants.USER_PERMISSION),
   async function (req, res, next) {
      try {
         let transactionHistorys = await transactionHistory.GetTransactionHistoryByUserId(req.user._id);
         if (!transactionHistorys || transactionHistorys.length === 0) {
            return res.status(404).json({ message: "Khong tim thay transactionHistory cua user" });
         }
         CreateSuccessRes(res, transactionHistorys, 200);
      } catch (error) {
         next(error);
      }
   }
);

// lay transactionHistory theo id
router.get(
   "/:id",
   check_authentication,
   check_authorization(constants.USER_PERMISSION),
   async function (req, res, next) {
      try {
         let transactionHistorys = await transactionHistory.GetTransactionHistoryById(req.params.id);
         CreateSuccessRes(res, transactionHistorys, 200);
      } catch (error) {
         next(error);
      }
   }
);
// lay transactionHistory theo order id
router.get(
   "/order/:id",
   check_authentication,
   check_authorization(constants.USER_PERMISSION),
   async function (req, res, next) {
      try {
         let transactionHistorys = await transactionHistory.GetAllTransactionHistoryByOrderId(req.params.id);
         if (!transactionHistorys || transactionHistorys.length === 0) {
            return res.status(404).json({ message: "Khong tim thay transactionHistory cua order" });
         }
         CreateSuccessRes(res, transactionHistorys, 200);
      } catch (error) {
         next(error);
      }
   }
);

// tao transactionHistory
router.post(
   "/",
   check_authentication,
   check_authorization(constants.USER_PERMISSION),
   async function (req, res, next) {
      try {
         let body = req.body;
         let transactionHistorys = await transactionHistory.CreateATransactionHistory(req.user._id, body.orderId, body.action, body.amount);
         CreateSuccessRes(res, transactionHistorys, 200);
      } catch (error) {
         next(error);
      }
   }
);
// update transactionHistory
router.put(
   "/:id",
   check_authentication,
   check_authorization(constants.MOD_PERMISSION),
   async function (req, res, next) {
      try {
         let body = req.body;
         let transactionHistorys = await transactionHistory.UpdateTransactionHistory(req.params.id, body);
         CreateSuccessRes(res, transactionHistorys, 200);
      } catch (error) {
         next(error);
      }
   }
);
// xoa transactionHistory
router.delete(
   "/:id",
   check_authentication,
   check_authorization(constants.MOD_PERMISSION),
   async function (req, res, next) {
      try {
         let transactionHistorys = await transactionHistory.DeleteTransactionHistory(req.params.id);
         CreateSuccessRes(res, transactionHistorys, 200);
      } catch (error) {
         next(error);
      }
   }
);

module.exports = router;