let supplierModel = require('../schemas/supplier');

module.exports = {

    //lấy toàn bộ nhà cung cấp
    getAllSupplier: async () => {
        try {
            let suppliers = await supplierModel.find({isDeleted: false});
            return suppliers;
        } catch (error) {
            throw new Error(error.message)
        }
    },

    //lấy 1 nhà cung cấp theo id
    getSupplierById: async (id) => {
        try {
            let supplier = await supplierModel.findOne({
                _id: id,
                isDeleted: false
            });
            return supplier;
        } catch (error) {
            throw new Error(error.message)
        }
    },

    //tạo mới 1 nhà cung cấp
    CreateNewSupplier: async (body) => {
        try {
            let newSupplier = new supplierModel({
                company_name: body.company_name,
                contact_name: body.contact_name,
                contact_title: body.contact_title,
                phone: body.phone,
                email: body.email,
                address: body.address,
                website: body.website,
                certification_details: body.certification_details,
                description: body.description
            });
            await newSupplier.save();
            return newSupplier;
        } catch (error) {
            throw new Error(error.message)
        }
    },

    //chỉnh sửa 1 nhà cung cấp
    ModifySupplier: async (id, body) => {
        try {
            let supplier = await supplierModel.findById(id);
            if (supplier) {
                if (body.company_name) {
                    supplier.company_name = body.company_name;
                }
                if (body.contact_name) {
                    supplier.contact_name = body.contact_name;
                }
                if (body.contact_title) {
                    supplier.contact_title = body.contact_title;
                }
                if (body.phone) {
                    supplier.phone = body.phone;
                }
                if (body.email) {
                    supplier.email = body.email;
                }
                if (body.address) {
                    supplier.address = body.address;
                }
                if (body.website) {
                    supplier.website = body.website;
                }
                if (body.certification_details) {
                    supplier.certification_details = body.certification_details;
                }
                if (body.description) {
                    supplier.description = body.description;
                }

                return await supplier.save();
            }
            else {
                throw new Error("khong tim thay supplier")
            }
        } catch (error) {
            throw new Error(error.message)
        }
    },

    //xóa 1 nhà cung cấp thông qua xóa mềm
    DeleteSupplier: async (id) => {
        try {
            let supplier = await supplierModel.findById(id);
            if (!supplier) {
                throw new Error("khong tim thay supplier")
            }
            supplier.isDeleted = true;
            return await supplier.save();
        } catch (error) {
            throw new Error(error.message)
        }
    }

}