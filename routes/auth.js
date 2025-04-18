var express = require("express");
var router = express.Router();
var userController = require("../controllers/users");
let { CreateSuccessRes } = require("../utils/responseHandler");
let jwt = require("jsonwebtoken");
let constants = require("../utils/constants");
let { check_authentication } = require("../utils/check_auth");

/* GET home page. */
router.post("/login", async function (req, res, next) {
  try {
    const body = req.body;
    const username = body.username;
    const password = body.password;
    const userID = await userController.CheckLogin(username, password);
    const access_token = jwt.sign(
      {
        id: userID,
        expire: new Date(Date.now() + 60 * 60 * 1000).getTime(),
      },
      constants.SECRET_KEY,
      { expiresIn: "1d" }
    );
    const refresh_token = jwt.sign(
      {
        id: userID,
        type: "refresh",
      },
      constants.SECRET_KEY,
      { expiresIn: "7d" }
    );
    CreateSuccessRes(
      res,
      {
        access_token,
        refresh_token,
      },
      200
    );
  } catch (error) {
    next(error);
  }
});

router.post("/signup", async function (req, res, next) {
  try {
    let body = req.body;
    let newUser = await userController.CreateAnUser(
      body.username,
      body.password,
      body.email,
      body.phone,
      "user"
    );
    CreateSuccessRes(
      res,
      jwt.sign(
        {
          id: newUser._id,
          expire: new Date(Date.now() + 60 * 60 * 1000).getTime(),
        },
        constants.SECRET_KEY
      ),
      200
    );
  } catch (error) {
    next(error);
  }
});
router.post(
  "/changepassword",
  check_authentication,
  async function (req, res, next) {
    try {
      let body = req.body;
      let oldpassword = body.oldpassword;
      let newpassword = body.newpassword;
      let result = await userController.ChangePassword(
        req.user,
        oldpassword,
        newpassword
      );
      CreateSuccessRes(res, result, 200);
    } catch (error) {
      next(error);
    }
  }
);
router.post("/logout", check_authentication, function (req, res, next) {
  try {
    CreateSuccessRes(res, { message: "Đăng xuất thành công" }, 200);
  } catch (error) {
    next(error);
  }
});

router.get("/me", check_authentication, async function (req, res, next) {
  console.log(req.user);
  CreateSuccessRes(res, req.user, 200);
});

module.exports = router;
