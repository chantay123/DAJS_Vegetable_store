const express = require("express");
const router = express.Router();
const Stock = require("../schemas/stock");
const {
    CreateErrorRes,
    CreateSuccessRes,
} = require("../utils/responseHandler");

// Lấy tất cả stock (Chỉ lấy những stock chưa bị xóa)
router.get("/", async function (req, res, next) {
    try {
        const stocks = await Stock.find({ isDeleted: false }).populate(
            "prod_id"
        );

        if (!stocks || stocks.length === 0) {
            return CreateErrorRes(res, "No stocks found", 404);
        }

        return CreateSuccessRes(res, stocks, 200);
    } catch (error) {
        next(error);
    }
});

// Tạo mới stock
router.post("/", async function (req, res, next) {
    try {
        const { prod_id, quantity, max_quantity } = req.body;

        if (!prod_id || quantity == null) {
            return CreateErrorRes(
                res,
                "Product ID and quantity are required",
                400
            );
        }

        if (quantity < 0) {
            return CreateErrorRes(res, "Quantity cannot be negative", 400);
        }

        const stock = new Stock({
            prod_id,
            quantity,
            max_quantity: max_quantity || quantity,
            available_quantity: quantity,
        });

        await stock.save();
        return CreateSuccessRes(res, stock, 201);
    } catch (error) {
        if (error.name === "ValidationError") {
            return CreateErrorRes(res, error.message, 400);
        }
        next(error);
    }
});

// Cập nhật stock
router.put("/:id", async function (req, res, next) {
    try {
        const { quantity, max_quantity } = req.body;

        if (quantity != null && quantity < 0) {
            return CreateErrorRes(res, "Quantity cannot be negative", 400);
        }

        const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!stock) {
            return CreateErrorRes(res, "Stock not found", 404);
        }

        return CreateSuccessRes(res, stock, 200);
    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return CreateErrorRes(res, error.message, 400);
        }
        next(error);
    }
});

// Xóa mềm stock (Đánh dấu isDeleted: true)
router.delete("/:id", async function (req, res, next) {
    try {
        const stock = await Stock.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        if (!stock) {
            return CreateErrorRes(res, "Stock not found", 404);
        }

        return CreateSuccessRes(
            res,
            { message: "Stock soft deleted successfully" },
            200
        );
    } catch (error) {
        if (error.name === "CastError") {
            return CreateErrorRes(res, "Invalid stock ID format", 400);
        }
        next(error);
    }
});

// Xóa mềm nhiều stock cùng lúc
router.delete("/", async function (req, res, next) {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return CreateErrorRes(res, "Invalid stock IDs", 400);
        }

        const result = await Stock.updateMany(
            { _id: { $in: ids } },
            { isDeleted: true }
        );

        return CreateSuccessRes(
            res,
            {
                message: "Stocks soft deleted successfully",
                modifiedCount: result.modifiedCount,
            },
            200
        );
    } catch (error) {
        next(error);
    }
});

// Phân trang stock (Chỉ lấy những stock chưa bị xóa)
router.get("/pagination", async function (req, res, next) {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(
            100,
            Math.max(1, parseInt(req.query.limit) || 10)
        );
        const skip = (page - 1) * limit;

        const totalStocks = await Stock.countDocuments({ isDeleted: false });
        const totalPages = Math.ceil(totalStocks / limit);

        const stocks = await Stock.find({ isDeleted: false })
            .populate("prod_id")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        if (!stocks || stocks.length === 0) {
            return CreateErrorRes(res, "No stocks found", 404);
        }

        return CreateSuccessRes(
            res,
            {
                stocks,
                currentPage: page,
                totalPages,
                totalStocks,
                pageSize: limit,
            },
            200
        );
    } catch (error) {
        next(error);
    }
});

module.exports = router;
