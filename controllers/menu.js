var menuModel = require('../schemas/menu');
const { generateSlug } = require('../utils/generate_slug');

module.exports = {
    GetAllMenu: async function () {
        try {
            const menus = await menuModel.find({ isDeleted: false }).lean(); // Lấy toàn bộ menu
    
            // Tạo object lưu các menu theo _id
            const menuMap = {};
            menus.forEach(menu => menuMap[menu._id] = { ...menu, children: [] });
    
            // Tạo cây menu
            const rootMenus = [];
            menus.forEach(menu => {
                if (menu.parent) {
                    // Nếu có parent, thêm vào danh sách con của menu cha
                    if (menuMap[menu.parent]) {
                        menuMap[menu.parent].children.push(menuMap[menu._id]);
                    }
                } else {
                    // Nếu không có parent, đây là menu gốc
                    rootMenus.push(menuMap[menu._id]);
                }
            });
    
            return rootMenus;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    CreateNewMenu: async function (body) {
        try {
            let menu;
            if(body.parent){
                menu = await menuModel.findOne({name: body.parent, isDeleted: false});
                if(!menu){
                    throw new Error("khong tim thay menu");
                }
            }
            let newMenu = new menuModel({
                name: body.name,
                URL: '/' + generateSlug(body.name),
                parent: menu
            });
            
            return await newMenu.save();
        }
        catch (error) {
            throw new Error(error.message)
        }
    },

    ModifyMenu: async function (id, body) {
        try {
            let menu = await menuModel.findById(id);
            if (!menu) {
                throw new Error("khong tim thay menu");
            }
            if (body.name) {
                menu.name = body.name;
                menu.URL = '/' + generateSlug(body.name);
            }
            if (body.parent) {
                let menuParent = await menuModel.findOne({name: body.parent, isDeleted: false});
                if(!menuParent){
                    throw new Error("khong tim thay menu");
                }
                menu.parent = menuParent._id;
            }
            return await menu.save();
        }
        catch (error) {
            throw new Error(error.message)
        }
    },

    DeleteMenu: async function (id) {
        try {
            let menu = await menuModel.findById(id);
            if (!menu) {
                throw new Error("khong tim thay menu");
            }
            menu.isDeleted = true;
            return await menu.save();
        }
        catch (error) {
            throw new Error(error.message)
        }
    }
}