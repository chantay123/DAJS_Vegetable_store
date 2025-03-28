var express = require('express');
var router = express.Router();
let supplierController = require('../controllers/supplier');
let { CreateSuccessResponse } = require('../utils/responseHandler');
let { check_authentication, check_authorization } = require('../utils/check_auth');
let constants = require('../utils/constants');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  let suppliers = await supplierController.getAllSupplier();
  CreateSuccessResponse(res, suppliers, 200);
});

router.get('/:id', async function (req, res, next) {
  let supplier = await supplierController.getSupplierById(req.params.id);
  CreateSuccessResponse(res, supplier, 200);
});

router.post('/add', async function (req, res, next) {
  try {
    let body = req.body;
    let newSupplier = await supplierController.CreateNewSupplier(body);
    CreateSuccessResponse(res, newSupplier, 200);
  }
  catch (error) {
    next(error)
  }
});

router.put('/:id', async function (req, res, next) {
  let id = req.params.id;
  try {
    let body = req.body
    let updateSupplier = await supplierController.ModifySupplier(id, body);
    CreateSuccessResponse(res, updateSupplier, 200);
  } catch (error) {
    next(error)
  }
});

router.delete('/:id', async function (req, res, next) {
  let id = req.params.id;
  try {
    let updateProduct = await supplierController.DeleteSupplier(id);
    CreateSuccessResponse(res, updateProduct, 200);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
