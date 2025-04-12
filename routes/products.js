var express = require("express");
var router = express.Router();
let productController = require("../controllers/product");
let { CreateSuccessRes } = require("../utils/responseHandler");
let {
  check_authentication,
  check_authorization,
} = require("../utils/check_auth");
let constants = require("../utils/constants");

//tạo đường dẫn lấy toàn bộ sản phẩm
router.get("/", check_authentication, check_authorization(constants.USER_PERMISSION), async function (req, res, next) {
  let products = await productController.getAllProduct();
  CreateSuccessRes(res, products, 200);
});

//tạo đường dẫn lấy 1 sản phẩm theo id
router.get("/:id", check_authentication, check_authorization(constants.USER_PERMISSION), async function (req, res, next) {
  let product = await productController.getProductById(req.params.id);
  CreateSuccessRes(res, product, 200);
});

//tạo đường dẫn tạo mới 1 sản phẩm
router.post("/add", check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body;
    let newProduct = await productController.CreateNewProduct(body);
    CreateSuccessRes(res, newProduct, 200);
  } catch (error) {
    next(error);
  }
});

// tạo đường dẫn chỉnh sửa 1 sản phẩm theo id sản phẩm
router.put("/:id", check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  let id = req.params.id;
  try {
    let body = req.body;
    console.log(body);
    let updateProduct = await productController.ModifyProduct(id, body);
    CreateSuccessRes(res, updateProduct, 200);
  } catch (error) {
    next(error);
  }
});

// tạo đường dẫn xóa 1 sản phẩm theo id sản phẩm
router.delete("/:id", check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  let id = req.params.id;
  try {
    let updateProduct = await productController.DeleteProduct(id);
    CreateSuccessRes(res, updateProduct, 200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
