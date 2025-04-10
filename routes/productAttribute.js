var express = require('express');
var router = express.Router();
let productAttributeController = require('../controllers/productAttribute');
let { CreateSuccessRes } = require('../utils/responseHandler');
let {
    check_authentication,
    check_authorization,
} = require("../utils/check_auth");
let constants = require("../utils/constants");


/* GET users listing. */
//tạo đường dẫn lấy thông tin thuộc tính của sản phẩm thông qua id sản phẩm
router.get('/:prod_id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
    let prod_id = req.params.prod_id;
    let productAttribute = await productAttributeController.getProductAttribute(prod_id);
    CreateSuccessRes(res, productAttribute, 200);
});

//tạo đường dẫn chỉnh sửa thống tin thuộc tính cho 1 sản phẩm
router.put('/:prod_id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
    let prod_id = req.params.prod_id;
    try {
        let body = req.body
        let updateProductAttribute = await productAttributeController.ModifyProductAttribute(prod_id, body);
        CreateSuccessRes(res, updateProductAttribute, 200);
    } catch (error) {
        next(error)
    }
});

module.exports = router;
