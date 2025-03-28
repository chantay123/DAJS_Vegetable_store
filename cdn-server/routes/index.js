var express = require('express');
var router = express.Router();
let multer = require('multer');
let path = require('path');
let {CreateSuccessRes,CreateErrorRes} = require('../utils/responseHandler');

let imageDir = path.join(__dirname,'../uploads');
let urlImage = 'http://localhost:4000/uploads/';

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imageDir),
  filename: (req, file, cb) => cb(null,
      (new Date(Date.now())).getTime() + '-' + file.originalname
  )
});
//upload image
let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/image/)) {
          cb(new Error("Ảnh không đúng định dạng"))
      }
      cb(null, true)
  }, limits: {
      fileSize: 10 * 1024 * 1024
  }
});

router.post('/upload_images', upload.single('image'), function (req, res, next) {
  try {
      if (!req.file) {
          throw new Error("không có file")
      } else {
          let URL = path.join(urlImage, req.file.filename);
          CreateSuccessRes(res, {
              url: URL
          }, 200);
      }
  } catch (error) {
      next(error)
  }
})

router.get('/uploads/:filename', function (req, res, next) {
  let pathFile = path.join(imageDir, req.params.filename);
  res.sendFile(pathFile)
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
