const express = require("express");
const router = express.Router();
const {
    CreateErrorRes,
    CreateSuccessRes,
} = require("../utils/responseHandler");
const stockController = require("../controllers/stock");

// Lấy danh sách stock có phân trang
router.get("/", async function (req, res, next) {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let stocks = await stockController.GetAllStock(page, limit);
        CreateSuccessRes(res, stocks, 200);
    } catch (error) {
        next(error);
    }
});

// Lấy thông tin stock theo ID
router.get("/:id", async function (req, res, next) {
    try {
        let stock = await stockController.GetStockById(req.params.id);
        if (!stock) {
            CreateErrorRes(res, "Stock not found", 404);
            return;
        }
        CreateSuccessRes(res, stock, 200);
    } catch (error) {
        next(error);
    }
});

// Thêm stock mới
router.post("/", async function (req, res, next) {
    try {
        let newStock = await stockController.CreateStock(req.body);
        CreateSuccessRes(res, newStock, 200);
    } catch (error) {
        next(error);
    }
});

// Cập nhật stock
router.put("/:id", async function (req, res, next) {
    try {
        let stock = await stockController.GetStockById(req.params.id);
        if (!stock) {
            return CreateErrorRes(res, "Stock not found", 404);
        }
        let updatedStock = await stockController.UpdateStock(
            req.params.id,
            req.body
        );
        CreateSuccessRes(res, updatedStock, 200);
    } catch (error) {
        next(error);
    }
});

// Xóa mềm stock
router.delete("/:id", async function (req, res, next) {
    try {
        let stock = await stockController.GetStockById(req.params.id);
        if (!stock) {
            return CreateErrorRes(res, "Stock not found", 404);
        }
        await stockController.DeleteStock(req.params.id);
        CreateSuccessRes(res, "Stock has been deleted", 200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
