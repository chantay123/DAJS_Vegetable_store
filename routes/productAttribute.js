var express = require('express');
var router = express.Router();
let productAttributeController = require('../controllers/productAttribute');
let { CreateSuccessResponse } = require('../utils/responseHandler');

/* GET users listing. */
router.get('/:prod_id', async function (req, res, next) {
    let prod_id = req.params.prod_id;
    let productAttribute = await productAttributeController.getProductAttribute(prod_id);
    CreateSuccessResponse(res, productAttribute, 200);
});

router.put('/:prod_id', async function (req, res, next) {
    let prod_id = req.params.prod_id;
    try {
        let body = req.body
        let updateProductAttribute = await productAttributeController.ModifyProductAttribute(prod_id, body);
        CreateSuccessResponse(res, updateProductAttribute, 200);
    } catch (error) {
        next(error)
    }
});

module.exports = router;
