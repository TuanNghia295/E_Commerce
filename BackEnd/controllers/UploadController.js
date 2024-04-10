require("dotenv").config();
// using fs.unlink to delete files
const fs = require("fs");
const { promisify } = require("util");

const unLinkAsync = promisify(fs.unlink);

class UploadController {
  // [POST] /upload
  async uploadCourses(req, res, next) {
    res.json({
      success: true,
      image_url: `http://localhost:${process.env.PORT}/images/${req.file.filename}`,
    });
  }
}

module.exports = new UploadController();
