const InventoryModel = require("../schemas/inventory");

module.exports = {
    GetAllInventory: async function (page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return await InventoryModel.find({ is_deleted: false })
            .populate("stock_id", "quantity")
            .populate("supplier_id", "name")
            .skip(skip)
            .limit(limit);
    },

    GetInventoryById: async function (id) {
        return await InventoryModel.findOne({ _id: id, is_deleted: false })
            .populate("stock_id", "quantity")
            .populate("supplier_id", "name");
    },

    CreateInventory: async function (data) {
        try {
            let newInventory = new InventoryModel({
                stock_id: data.stock_id,
                supplier_id: data.supplier_id,
                quantity_change: data.quantity_change,
                movement_date: data.movement_date,
                is_deleted: false,
            });
            return await newInventory.save();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    UpdateInventory: async function (id, data) {
        try {
            let updatedInfo = {};
            if (data.stock_id !== undefined)
                updatedInfo.stock_id = data.stock_id;
            if (data.supplier_id !== undefined)
                updatedInfo.supplier_id = data.supplier_id;
            if (data.quantity_change !== undefined)
                updatedInfo.quantity_change = data.quantity_change;
            if (data.movement_date !== undefined)
                updatedInfo.movement_date = data.movement_date;

            return await InventoryModel.findByIdAndUpdate(id, updatedInfo, {
                new: true,
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    DeleteInventory: async function (id) {
        try {
            return await InventoryModel.findByIdAndUpdate(
                id,
                { is_deleted: true },
                { new: true }
            );
        } catch (error) {
            throw new Error(error.message);
        }
    },
};
