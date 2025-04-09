var express = require("express");
var router = express.Router();
let { CreateErrorRes, CreateSuccessRes } = require("../utils/responseHandler");
const {
    check_authorization,
    check_authentication,
} = require("../utils/check_auth");
const constants = require("../utils/constants");

let likeController = require("../controllers/like");

router.get("/", async function (req, res, next) {
    try {
        let likes = await likeController.GetAllLikes();
        CreateSuccessRes(res, likes, 200);
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async function (req, res, next) {
    try {
        let like = await likeController.GetLikeById(req.params.id);
        if (!like) {
            CreateErrorRes(res, "Like not found", 404);
            return;
        }
        CreateSuccessRes(res, like, 200);
    } catch (error) {
        next(error);
    }
});

router.get("/product/:prod_id", async function (req, res, next) {
    try {
        let likes = await likeController.GetLikesByProductId(req.params.prod_id);
        CreateSuccessRes(res, likes, 200);
    } catch (error) {
        next(error);
    }
});

router.post("/", async function (req, res, next) {
    try {
        let body = req.body;
        let newLike = await likeController.CreateALike({
            user_id: body.user_id,
            prod_id: body.prod_id,
        });
        CreateSuccessRes(res, newLike, 200);
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", async function (req, res, next) {
    try {
        let like = await likeController.GetLikeById(req.params.id);
        if (!like) {
            return CreateErrorRes(res, "Like not found", 404);
        }
        await likeController.DeleteALike(req.params.id);
        CreateSuccessRes(res, "Like has been deleted", 200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
