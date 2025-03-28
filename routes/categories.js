var express = require("express");
var router = express.Router();
let categoryModel = require("../schemas/category");
let { CreateErrorRes, CreateSuccessRes } = require("../utils/responseHandler");
const {
  check_authorization,
  check_authentication,
} = require("../utils/check_auth");
const constants = require("../utils/constants");
let categoryController = require("../controllers/category");
let multer = require('multer')
let path = require('path');
let axios = require("axios");
let FormData = require('form-data');
let fs = require('fs');
const { deserialize } = require("v8");

let imageDir = path.join(__dirname, '../cdn-server/uploads')
let postcdnURL = `http://localhost:4000/upload_images`

/* GET users listing. */
router.get("/", async function (req, res, next) {
  let categories = await categoryController.GetAllCategory();
  CreateSuccessRes(res, categories, 200);
});
router.get("/:id", async function (req, res, next) {
  try {
    let category = await categoryController.GetCategoryById(req.params.id);
    if (!category) {
      CreateErrorRes(res, "Category not found", 404);
      return;
    }
    CreateSuccessRes(res, category, 200);
  } catch (error) {
    next(error);
  }
});

// Cấu hình lưu trữ file bằng Multer
let storage = multer.diskStorage({
  // Thiết lập thư mục lưu ảnh tạm thời trước khi upload lên cdn-server
  destination: (req, file, cb) => cb(null, imageDir),
  // Đặt tên file theo timestamp để tránh trùng lặp
  filename: (req, file, cb) => cb(null,
    (new Date(Date.now())).getTime() + '-' + file.originalname
  )
})
//upload
let upload = multer({
  storage: storage, // Sử dụng cấu hình lưu trữ đã thiết lập
  fileFilter: (req, file, cb) => {
    // Kiểm tra định dạng file có phải là ảnh không
    if (!file.mimetype.match(/image/)) {
      cb(new Error("Ảnh không đúng định dạng")) // Báo lỗi nếu không đúng định dạng
    }
    cb(null, true) // Chấp nhận file hợp lệ
  }, limits: {
    fileSize: 10 * 1024 * 1024 // Giới hạn kích thước ảnh tối đa 10MB
  }
});
router.post(
  "/",
  check_authentication,
  check_authorization(constants.MOD_PERMISSION),
  upload.single('image'), // Middleware xử lý upload 1 file ảnh duy nhất
  async function (req, res, next) {
    try {
      let body = req.body; // Lấy dữ liệu từ request body
      let imageUrl = ""; // Đường dẫn ảnh sau khi upload
      // Kiểm tra nếu không có file ảnh gửi lên
      if (!req.file) {
        throw new Error("không có file")
      } else {
        // Nếu có file ảnh, tiến hành upload lên cdn-server
        let formData = new FormData();
        let imageFile = path.join(imageDir, req.file.filename);
        formData.append('image', fs.createReadStream(imageFile));

        // Gửi ảnh đến API của cdn-server để lấy URL
        let result = await axios.post(
          postcdnURL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        fs.unlinkSync(imageFile); // Xóa ảnh tạm sau khi upload xong
        imageUrl = result.data.data.url; // Lấy URL ảnh từ response của cdn-server
      }
      // Gọi controller để tạo mới category
      let newCategory = await categoryController.CreateACategory({
        name: body.name,
        description: body.description,
        image: imageUrl
      });
      CreateSuccessRes(res, newCategory, 200);
    } catch (error) {
      next(error);
    }
  }
);
router.put(
  "/:id",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  upload.single('image'),
  async function (req, res, next) {
    let id = req.params.id;
    try {
      let category = await categoryController.GetCategoryById(id);
      if (!category) {
        return CreateErrorRes(res, "Category not found", 404);
      }
      let body = req.body;
      // Giữ ảnh cũ nếu không upload mới
      let imageUrl = category.image; 
      if (req.file) {
        // Nếu có file mới, upload lên cdn-server
        let formData = new FormData();
        let imageFile = path.join(imageDir, req.file.filename);
        formData.append('image', fs.createReadStream(imageFile));

        let result = await axios.post(postcdnURL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        fs.unlinkSync(imageFile); // Xóa ảnh tạm trên server
        imageUrl = result.data.data.url;
      }
      // Gọi controller để cập nhật category
      let updatedCategory = await categoryController.UpdateACategory(id, {
        name: body.name,
        description: body.description,
        image: imageUrl
      });

      CreateSuccessRes(res, updatedCategory, 200);
    } catch (error) {
      next(error);
    }
  }
);
router.delete(
  "/:id",
  check_authentication,
  check_authorization(constants.MOD_PERMISSION),
  async function (req, res, next) {
    let id = req.params.id;
    try {
      let category = await categoryController.GetCategoryById(id);
      if (!category) {
        return CreateErrorRes(res, "Category not found", 404);
      }
      let deletedCategory = await categoryController.DeleteACategory(id);
      CreateSuccessRes(res, "Category has been deleted", 200);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
