const express = require("express");
const router = express.Router();

const cartController = require("../controllers/CartController");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Viết hàm lấy dữ liệu của người dùng từ token tên là fetchUser
// Ở đây hàm sẽ trả về đúng tài khoản cần tìm bằng việc verify token
const fetchUser = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    // verify token để lấy ra key của user là userId
    // từ userId này, ta gửi nó ngược lại cho client hoặc xử lý tiếp trong server
    // với các hàm như get cart, add to cart,...
    const userInfo = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.PRIVATE_KEY_SESSION
    );

    // lưu userId vào req object
    req.userId = userInfo.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expired" });
    } else {
      res.status(500).json({ message: "An error occurred" });
    }
  }
};
router.post("/getcart", fetchUser, cartController.getcart);
router.post("/addtocart", fetchUser, cartController.addtocart);
router.post("/removefromcart", fetchUser, cartController.removefromcart);

module.exports = router;
