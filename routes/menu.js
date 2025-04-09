var express = require('express');
var router = express.Router();
let menuController = require('../controllers/menu');
let { CreateSuccessRes } = require('../utils/responseHandler');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  let menus = await menuController.GetAllMenu();
  CreateSuccessRes(res, menus, 200);
});

router.post('/add', async function (req, res, next) {
  try {
    let body = req.body;
    let newMenu = await menuController.CreateNewMenu(body);
    CreateSuccessRes(res, newMenu, 200);
  }
  catch (error) {
    next(error)
  }
});

router.put('/:id', async function (req, res, next) {
  let id = req.params.id;
  try {
    let body = req.body;
    let updateMenu = await menuController.ModifyMenu(id, body);
    CreateSuccessRes(res, updateMenu, 200);
  }
  catch (error) {
    next(error)
  }
});

router.delete('/:id', async function (req, res, next) {
  let id = req.params.id;
  try {
    let updateMenu = await menuController.DeleteMenu(id);
    CreateSuccessRes(res, updateMenu, 200);
  }
  catch (error) {
    next(error)
  }
});

module.exports = router;
