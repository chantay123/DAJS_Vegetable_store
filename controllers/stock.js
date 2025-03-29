const StockModel = require("../schemas/stock");

module.exports = {
    GetAllStock: async function (page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return await StockModel.find({ isDeleted: false })
            .populate("prod_id", "name") // Populate tên sản phẩm
            .skip(skip)
            .limit(limit);
    },

    GetStockById: async function (id) {
        return await StockModel.findOne({ _id: id, isDeleted: false }).populate(
            "prod_id",
            "name"
        );
    },

    CreateStock: async function (data) {
        try {
            let newStock = new StockModel({
                prod_id: data.prod_id,
                quantity: data.quantity,
                max_quantity: data.max_quantity || null,
                reserved_quantity: data.reserved_quantity || 0,
                available_quantity: data.available_quantity || 0,
                isDeleted: false,
            });
            return await newStock.save();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    UpdateStock: async function (id, data) {
        try {
            let updatedInfo = {};
            if (data.quantity !== undefined)
                updatedInfo.quantity = data.quantity;
            if (data.max_quantity !== undefined)
                updatedInfo.max_quantity = data.max_quantity;
            if (data.reserved_quantity !== undefined)
                updatedInfo.reserved_quantity = data.reserved_quantity;
            if (data.available_quantity !== undefined)
                updatedInfo.available_quantity = data.available_quantity;

            return await StockModel.findByIdAndUpdate(id, updatedInfo, {
                new: true,
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    DeleteStock: async function (id) {
        try {
            return await StockModel.findByIdAndUpdate(
                id,
                { isDeleted: true },
                { new: true }
            );
        } catch (error) {
            throw new Error(error.message);
        }
    },
};
