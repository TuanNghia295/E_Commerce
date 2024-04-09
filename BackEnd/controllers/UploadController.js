require("dotenv").config();

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
