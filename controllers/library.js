let libraryModel = require("../schemas/library");
let productModel = require("../schemas/products");
let userModel = require("../schemas/user");

module.exports = {
    
    GetAllLibraryByUser: async (user_id) => {
        try {
            let user = await userModel.findOne({ _id: user_id, status: false });
            if (!user) {
                throw new Error("Người dùng không tồn tại");
            }

            let libraries = await libraryModel.find({ user_id: user._id, isDeleted: false });
            if (!libraries) {
                throw new Error("Người dùng chưa có library");
            }
            return libraries;
        } catch (error) {
            throw new Error(error.message)
        }
    },

    // thêm vào library
    AddProductToLibrary: async (body, user_id) => {
        try {
            console.log(body);
            let product = await productModel.findOne({ _id: body.product, is_deleted: false });
            let user = await userModel.findOne({ _id: user_id, status: false });

            if (!product) {
                throw new Error("Không tìm thấy sản phẩm");
            }
            if (!user) {
                throw new Error("Không tìm thấy người dùng");
            }

            let existProduct = await libraryModel.findOne({ user_id: user._id, prod_id: product._id, isDeleted: false });
            if (existProduct) {
                throw new Error("Sản phần này đã tồn tại trong library");
            }

            let newLibrary = new libraryModel({
                user_id: user._id,
                prod_id: product._id,
            });

            await newLibrary.save();

            return newLibrary;
        } catch (error) {
            throw new Error(error.message)
        }
    },

    DeleteProductFromLibrary: async (id) => {
        try {
            let library = await libraryModel.findOne({ _id: id});
            if (!library) {
                throw new Error("Không tìm thấy library");
            }
            library.isDeleted = true;
            return await library.save();
        } catch (error) {
            throw new Error(error.message)
        }
    }
}