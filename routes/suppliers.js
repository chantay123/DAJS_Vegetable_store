const express = require("express");
const router = express.Router();
const Supplier = require("../schemas/supplier");
const {
    CreateErrorRes,
    CreateSuccessRes,
} = require("../utils/responseHandler");

// Lấy danh sách nhà cung cấp (Chỉ lấy nhà cung cấp chưa bị xóa)
router.get("/", async (req, res, next) => {
    try {
        const suppliers = await Supplier.find({ isDeleted: false });
        CreateSuccessRes(res, suppliers, 200);
    } catch (error) {
        next(error);
    }
});

// Lấy thông tin nhà cung cấp theo ID (Chỉ lấy nếu chưa bị xóa)
router.get("/:id", async (req, res, next) => {
    try {
        const supplier = await Supplier.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!supplier) {
            return CreateErrorRes(res, "Nhà cung cấp không tồn tại", 404);
        }
        CreateSuccessRes(res, supplier, 200);
    } catch (error) {
        next(error);
    }
});

// Thêm nhà cung cấp mới
router.post("/", async (req, res, next) => {
    try {
        const newSupplier = new Supplier(req.body);
        await newSupplier.save();
        CreateSuccessRes(res, newSupplier, 201);
    } catch (error) {
        next(error);
    }
});

// Cập nhật nhà cung cấp theo ID (Chỉ cập nhật nếu chưa bị xóa)
router.put("/:id", async (req, res, next) => {
    try {
        const updatedSupplier = await Supplier.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (!updatedSupplier) {
            return CreateErrorRes(
                res,
                "Nhà cung cấp không tồn tại hoặc đã bị xóa",
                404
            );
        }
        CreateSuccessRes(res, updatedSupplier, 200);
    } catch (error) {
        next(error);
    }
});

// Xóa mềm nhà cung cấp (Cập nhật isDeleted = true thay vì xóa hẳn)
router.delete("/:id", async (req, res, next) => {
    try {
        const deletedSupplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (!deletedSupplier) {
            return CreateErrorRes(res, "Nhà cung cấp không tồn tại", 404);
        }
        CreateSuccessRes(res, { message: "Xóa mềm thành công" }, 200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
