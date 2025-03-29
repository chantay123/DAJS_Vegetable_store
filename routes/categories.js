var express = require("express");
var router = express.Router();
let { CreateErrorRes, CreateSuccessRes } = require("../utils/responseHandler");
const {
  check_authorization,
  check_authentication,
} = require("../utils/check_auth");
const constants = require("../utils/constants");
let categoryController = require("../controllers/category");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  let categories = await categoryController.GetAllCategory();
  CreateSuccessRes(res, categories, 200);
});
router.get("/:id", async function (req, res, next) {
  try {
    let category = await categoryController.GetCategoryById(req.params.id);
    if (!category) {
      CreateErrorRes(res, "Category not found", 404);
      return;
    }
    CreateSuccessRes(res, category, 200);
  } catch (error) {
    next(error);
  }
});


router.post(
  "/",
  // check_authentication,
  // check_authorization(constants.MOD_PERMISSION),
  async function (req, res, next) {
    try {
      let body = req.body; // Lấy dữ liệu từ request body
      // Gọi controller để tạo mới category
      let newCategory = await categoryController.CreateACategory({
        name: body.name,
        description: body.description,
        image: body.image,
      });
      CreateSuccessRes(res, newCategory, 200);
    } catch (error) {
      next(error);
    }
  }
);
router.put(
  "/:id",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    let id = req.params.id;
    try {
      let category = await categoryController.GetCategoryById(id);
      if (!category) {
        return CreateErrorRes(res, "Category not found", 404);
      }
      let body = req.body;
      // Gọi controller để cập nhật category
      let updatedCategory = await categoryController.UpdateACategory(id, {
        name: body.name,
        description: body.description,
        image: body.image,
      });

      CreateSuccessRes(res, updatedCategory, 200);
    } catch (error) {
      next(error);
    }
  }
);
router.delete(
  "/:id",
  check_authentication,
  check_authorization(constants.MOD_PERMISSION),
  async function (req, res, next) {
    let id = req.params.id;
    try {
      let category = await categoryController.GetCategoryById(id);
      if (!category) {
        return CreateErrorRes(res, "Category not found", 404);
      }
      let deletedCategory = await categoryController.DeleteACategory(id);
      CreateSuccessRes(res, "Category has been deleted", 200);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
