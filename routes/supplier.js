var express = require("express");
var router = express.Router();
let supplierController = require("../controllers/supplier");
let { CreateSuccessRes } = require("../utils/responseHandler");
let {
  check_authentication,
  check_authorization,
} = require("../utils/check_auth");
let constants = require("../utils/constants");

/* GET users listing. */
// tạo đường dẫn lấy toàn bộ nhà cung cấp
router.get("/", check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  let suppliers = await supplierController.getAllSupplier();
  CreateSuccessRes(res, suppliers, 200);
});

// tạo đường dẫn lấy 1 nhà cung cấp theo id
router.get("/:id", check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  let supplier = await supplierController.getSupplierById(req.params.id);
  CreateSuccessRes(res, supplier, 200);
});

// tạo đường dẫn tạo mới 1 nhà cung cấp
router.post("/add", check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body;
    let newSupplier = await supplierController.CreateNewSupplier(body);
    CreateSuccessRes(res, newSupplier, 200);
  } catch (error) {
    next(error);
  }
});

// tạo đường dẫn chỉnh sửa 1 nhà cung cấp theo id
router.put("/:id", check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  let id = req.params.id;
  try {
    let body = req.body;
    let updateSupplier = await supplierController.ModifySupplier(id, body);
    CreateSuccessRes(res, updateSupplier, 200);
  } catch (error) {
    next(error);
  }
});

// tạo đường dẫn xóa 1 nhà cung cấp theo id
router.delete("/:id", check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  let id = req.params.id;
  try {
    let updateProduct = await supplierController.DeleteSupplier(id);
    CreateSuccessRes(res, updateProduct, 200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
