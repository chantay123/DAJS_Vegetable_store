var express = require("express");
var router = express.Router();
let libraryController = require("../controllers/library");
let { CreateSuccessRes } = require("../utils/responseHandler");
let {
    check_authentication,
    check_authorization,
} = require("../utils/check_auth");
let constants = require("../utils/constants");


//tạo đường dẫn lấy toàn bộ thư viện
router.get("/", check_authentication, check_authorization(constants.USER_PERMISSION), async function (req, res, next) {
    let user = req.user;
    let libraries = await libraryController.GetAllLibraryByUser(user._id);
    CreateSuccessRes(res, libraries, 200);
});

//tạo đường dẫn thêm sản phẩm vào thư viện của người dùng
router.post("/add", check_authentication, check_authorization(constants.USER_PERMISSION), async function (req, res, next) {
    try {
        let body = req.body;
        let user = req.user;
        let addToLibrary = await libraryController.AddProductToLibrary(body, user._id);
        CreateSuccessRes(res, addToLibrary, 200);
    } catch (error) {
        next(error);
    }
});

// tạo đường dẫn xóa 1 sản phẩm khỏi thư viện của người dùng
router.delete("/:id", check_authentication, check_authorization(constants.USER_PERMISSION), async function (req, res, next) {
    let id = req.params.id;
    try {
        let updateLibrary = await libraryController.DeleteProductFromLibrary(id);
        CreateSuccessRes(res, updateLibrary, 200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
