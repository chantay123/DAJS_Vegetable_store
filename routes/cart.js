var express = require("express");
var router = express.Router();
let jwt = require("jsonwebtoken");
let cartController = require("../controllers/cart");
let {
    check_authentication,
    check_authorization,
} = require("../utils/check_auth");
let { CreateSuccessRes, CreateErrorRes } = require("../utils/responseHandler");
let constants = require("../utils/constants");
//get all cart
router.get(
    "/",
    check_authentication,
    check_authorization(constants.USER_PERMISSION),
    async function (req, res, next) {
        try {
            let carts = await cartController.GetAllCart();
            CreateSuccessRes(res, carts, 200);
        } catch (error) {
            next(error);
        }
    }
);
//get cart by id
router.get(
    "/:id",
    check_authentication,
    check_authorization(constants.USER_PERMISSION),
    async function (req, res, next) {
        try {
            let cart = await cartController.GetCartById(req.params.id);
            CreateSuccessRes(res, cart, 200);
        } catch (error) {
            next(error);
        }
    }
);
//get cart by username
//de test hay nhap http://localhost:3000/carts/?username=ten_nguoi_dung
router.get(
    "/:username",
    check_authentication,
    check_authorization(constants.USER_PERMISSION),
    async function (req, res, next) {
        try {
            let cart = await cartController.GetCartByUsername(
                req.query.username
            );
            CreateSuccessRes(res, cart, 200);
        } catch (error) {
            next(error);
        }
    }
);
// Lấy cart theo user ID từ token
router.get(
    "/me/cart",
    check_authentication,
    check_authorization(constants.USER_PERMISSION),
    async function (req, res, next) {
        try {
            let userId = req.user.id;
            let cart = await cartController.GetCartByUserId(userId);
            if (!cart) {
                return CreateErrorRes(res, "Cart not found", 404);
            }
            CreateSuccessRes(res, cart, 200);
        } catch (error) {
            next(error);
        }
    }
);
//create a cart
router.post(
    "/items/",
    check_authentication,
    check_authorization(constants.USER_PERMISSION),
    async function (req, res, next) {
        try {
            let body = req.body;
            let newCart = await cartController.CreateACart(body, req.user);
            CreateSuccessRes(res, newCart, 200);
        } catch (error) {
            next(error);
        }
    }
);
//update a cart
router.put(
    "/items/:id",
    check_authentication,
    check_authorization(constants.USER_PERMISSION),
    async function (req, res, next) {
        try {
            let id = req.params.id;
            let body = req.body;
            let updatedCart = await cartController.UpdateACart(id, body);
            CreateSuccessRes(res, updatedCart, 200);
        } catch (error) {
            next(error);
        }
    }
);
//delete a cart
router.delete(
    "/items/:id",
    check_authentication,
    check_authorization(constants.USER_PERMISSION),
    async function (req, res, next) {
        try {
            let id = req.params.id;
            await cartController.DeleteACart(id);
            CreateSuccessRes(res, "Cart has been deleted", 200);
        } catch (error) {
            next(error);
        }
    }
);

router.delete(
    "/product/:id",
    check_authentication,
    async function (req, res, next) {
        try {
            let id = req.params.id;
            let body = req.body
            await cartController.DeleteProCart(id, body);
            CreateSuccessRes(res, "Cart has been deleted", 200);
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
