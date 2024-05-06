require("dotenv").config();
const jwt = require("jsonwebtoken");
const fb = require("../database_connection/firebase");
const Product = require("../schema/product");
class PaymentController {
  // Get Config
  async config(req, res) {
    res.status(200).json({
      status: "OK",
      data: process.env.PAYPAL_CLIENT_ID,
    });
  }

  //   POST Cash
  async cash(req, res) {
    const cartItem = req.body;
    const token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        try {
          // Lấy token được gửi ở header
          // lấy userId từ token
          const userId = jwt.verify(
            token,
            process.env.PRIVATE_KEY_SESSION
          ).userId;

          const userRecord = await fb.ref("users").child(userId).get();
          if (!userRecord.exists()) {
            res.status(404).json({ success: false, message: "User not found" });
          } else {
            for (let item of cartItem) {
              // tìm sản phẩm trong database
              const product = await Product.findOne({
                pro_code: item.ID,
              });
              if (product && product.quantity >= item.quantity) {
                product.quantity -= item.quantity;
                await product.save();
              } else {
                return res.status(400).json({
                  success: false,
                  message: "Not enough product in stock",
                });
              }
            }
            res.json({ success: true });
          }
        } catch (error) {
          console.error(error);
          res
            .status(500)
            .json({ success: false, message: "Error verifying token" });
        }
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}

module.exports = new PaymentController();
