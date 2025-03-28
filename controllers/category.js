var categoryModel = require("../schemas/category");
module.exports = {
    GetAllCategory: async function () {
        return await categoryModel.find({
            isDeleted: false
        })
    },
    GetCategoryById: async function (id) {
        return await categoryModel.findOne({
            _id: id,
            isDeleted: false
        })
    },
    CreateACategory: async function (data) {
        try {
            let newCategory = new categoryModel({
                name: data.name,
                description: data.description || "",
                items: [],
                image: data.image,
                isDeleted: false
            })
            return await newCategory.save()
        } catch (error) {
            throw new Error(error.message)
        }
    },
    UpdateACategory: async function (id, data) {
        try {
            let updatedInfo = {};
            if (data.name) {
                updatedInfo.name = data.name;
            }
            if (data.description) {
                updatedInfo.description = data.description;
            }
            if (data.image) {
                updatedInfo.image = data.image;
            }
            return await categoryModel.findByIdAndUpdate(id, updatedInfo, {
                new: true
            })
        } catch (error) {
            throw new Error(error.message)
        }
    },
    DeleteACategory: async function (id) {
        try {
            return await categoryModel.findByIdAndUpdate(id, {
                isDeleted: true
            }, {
                new: true
            })
        } catch (error) {
            throw new Error(error.message)
        }
    }
};