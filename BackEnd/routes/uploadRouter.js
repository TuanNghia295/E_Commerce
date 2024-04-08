const express = require("express");
const router = express.Router();
const multer = require("multer");
const UploadController = require("../controllers/UploadController");
const path = require("path");


// creating upload endpoint for images
const storage = multer.diskStorage({
  // destination: nơi gửi tới, nơi đưa tới, nơi đi tới,sự dự định; mục đích dự định
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});


const upload = multer({ storage: storage });
// Middleware upload.single("product") sẽ xử lý việc tải lên một tệp tin
// và tệp tin này sẽ được gán vào trường có tên là "product" trong yêu cầu (req).
router.post("/", upload.single("product"), UploadController.uploadCourses);

module.exports = router;
