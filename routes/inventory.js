const express = require("express");
const router = express.Router();
const {
    CreateErrorRes,
    CreateSuccessRes,
} = require("../utils/responseHandler");
const inventoryController = require("../controllers/inventory");

// Lấy danh sách inventory có phân trang
router.get("/", async function (req, res, next) {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let inventories = await inventoryController.GetAllInventory(
            page,
            limit
        );
        CreateSuccessRes(res, inventories, 200);
    } catch (error) {
        next(error);
    }
});

// Lấy thông tin inventory theo ID
router.get("/:id", async function (req, res, next) {
    try {
        let inventory = await inventoryController.GetInventoryById(
            req.params.id
        );
        if (!inventory) {
            CreateErrorRes(res, "Inventory not found", 404);
            return;
        }
        CreateSuccessRes(res, inventory, 200);
    } catch (error) {
        next(error);
    }
});

// Thêm inventory mới
router.post("/", async function (req, res, next) {
    try {
        let newInventory = await inventoryController.CreateInventory(req.body);
        CreateSuccessRes(res, newInventory, 200);
    } catch (error) {
        next(error);
    }
});

// Cập nhật inventory
router.put("/:id", async function (req, res, next) {
    try {
        let inventory = await inventoryController.GetInventoryById(
            req.params.id
        );
        if (!inventory) {
            return CreateErrorRes(res, "Inventory not found", 404);
        }
        let updatedInventory = await inventoryController.UpdateInventory(
            req.params.id,
            req.body
        );
        CreateSuccessRes(res, updatedInventory, 200);
    } catch (error) {
        next(error);
    }
});

// Xóa mềm inventory
router.delete("/:id", async function (req, res, next) {
    try {
        let inventory = await inventoryController.GetInventoryById(
            req.params.id
        );
        if (!inventory) {
            return CreateErrorRes(res, "Inventory not found", 404);
        }
        await inventoryController.DeleteInventory(req.params.id);
        CreateSuccessRes(res, "Inventory has been deleted", 200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
