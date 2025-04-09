var likeModel = require("../schemas/like");

module.exports = {
    GetAllLikes: async function () {
        return await likeModel.find({});
    },

    GetLikeById: async function (id) {
        return await likeModel.findById(id);
    },

    CreateALike: async function (data) {
        try {
            let newLike = new likeModel({
                user_id: data.user_id,
                prod_id: data.prod_id,
            });
            return await newLike.save();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    DeleteALike: async function (id) {
        try {
            return await likeModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(error.message);
        }
    },
};
