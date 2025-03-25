var express = require("express");
var router = express.Router();
var roleController = require("../controllers/roles");
let { CreateErrorRes, CreateSuccessRes } = require("../utils/responseHandler");
const {
  check_authorization,
  check_authentication,
} = require("../utils/check_auth");
const constants = require("../utils/constants");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  let roles = await roleController.GetAllUser();
  CreateSuccessRes(res, roles, 200);
});

router.post(
  "/",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let newRole = await roleController.CreateARole(req.body.name);
      CreateSuccessRes(res, newRole, 200);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
