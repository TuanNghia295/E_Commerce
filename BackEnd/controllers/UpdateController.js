const { auth } = require("firebase-admin");
const fb = require("../database_connection/firebase");
const jwt = require("jsonwebtoken");
require("dotenv").config();
class UpdateController {
  // update Email
  // PUT /email
  async updateEmail(req, res) {
    // nhận email update từ body
    const email = req.body.email;
    // kiểm tra email có hợp lệ không
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid mail" });
    }
    try {
      // Lấy token được gửi ở header
      const token = req.headers.authorization.split(" ")[1];
      // lấy userId từ token
      const userId = jwt.verify(token, process.env.PRIVATE_KEY_SESSION).userId;

      // kiểm tra email có tồn tại trong authentication firebase không
      const userRecord = await auth()
        .getUserByEmail(email)
        .catch(() => null);
      if (userRecord) {
        return res.status(400).json({ message: "Email already exists" });
      }
      // cập nhật email cho user hiện đang đăng nhập
      await auth().updateUser(userId, { email });
      // cập nhật luôn ở realtimedatabase
      await fb.ref("users").child(userId).update({ email });
      return res.json({ success: true });
    } catch (error) {
      // Handle error
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating the email" });
    }
  }

  //   update Address
  //   PUT /address
  async updateAddress(req, res) {
    // Nhận dữ liệu từ body được gửi từ client
    const { fullName, address, phoneNumber } = req.body;

    try {
      // Lấy token được gửi từ header
      const token = req.headers.authorization.split(" ")[1];

      // Lấy userId bằng token
      const userId = jwt.verify(token, process.env.PRIVATE_KEY_SESSION).userId;

      // Lấy user từ database theo userId
      const user = await fb.ref("users").child(userId).get();
      if (user.exists()) {
        // Cập nhật dữ liệu mới
        await fb.ref("users").child(userId).update({
          fullName,
          address,
          phoneNumber,
        });
        return res.json({ success: true });
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while updating the address" });
    }
  }
}

module.exports = new UpdateController();
