const fb = require("../database_connection/firebase");
const jwt = require("jsonwebtoken");
const Product = require("../schema/product");
require("dotenv").config();
class CartController {
  // POST /cart/getcart
  async getcart(req, res) {
    const userId = req.userId;
    // Đảm bảo rằng userId là một chuỗi hợp lệ
    // ở đây, mục đích của ta là lấy ra cartData hiện có dựa trên
    // userId được gửi từ fetchUser.
    // cấu trúc của cartData trên firebase đã được cấu trúc thành
    // 1 nút riêng chứ không nằm trực tiếp bên trong nút người dùng
    // cho nên ở đây sử dụng method child
    const findUser = await fb.ref("users").child(userId).once("value");
    if (findUser.exists()) {
      // nếu như đã kiếm được user, tiến hành lấy cartData
      // của user đó để gửi tới client

      // lấy dữ liệu từ findUser
      const userData = findUser.val();
      // lấy cartData ra
      const cartData = userData.cartData;
      res.json({ success: true, cartData });
    } else {
      res.json({ success: false, error: "User not found" });
    }
  }

  //   POST /cart/addtocart
  // creating endpoints for addings products in data
  async addtocart(req, res) {
    // find user by key
    const userId = req.userId;
    const { itemID, size } = req.body;

    // Thực hiện truy vấn để lấy dữ liệu từ Firebase Realtime Database
    const userDataRef = fb.ref("users").child(userId).child("cartData");
    const snapshot = await userDataRef.once("value");
    let cartData = snapshot.val() || []; // Lấy giá trị của cartData từ snapshot, nếu không tồn tại, trả về một mảng rỗng

    // lấy thông tin sản phẩm từ database
    const productData = await Product.findOne({pro_code: itemID});

    // Thêm một giá trị mới vào mảng cartData
    const findExistingProduct = cartData.find(
      (item) => item.ID === itemID && item.size === size
    );
    console.log("exists", findExistingProduct);
    if (findExistingProduct) {
      // tăng quantity lên 1
      findExistingProduct.quantity += 1;
      await userDataRef.set(cartData);
      res.json({
        success: true,
        existed: true,
        update: findExistingProduct,
      });
    } else {
      const newProduct = {
        ...productData._doc,
        ID: itemID,
        quantity: 1,
        size: size,
      };
      cartData.push(newProduct);
      //  lưu cartData vào firebase sau khi thêm sản phẩm
      await userDataRef.set(cartData);
      res.json({ success: true, existed: false, update: newProduct });
    }
  }

  //   POST /cart/removefromcart
  // creating endpoints to remove products from cartdata
  async removefromcart(req, res) {
    const { itemID } = req.body;
    const userId = req.userId;
    let userDataRef = fb.ref("users").child(userId).child("cartData");

    try {
      const snapshot = await userDataRef.once("value");
      let cartData = snapshot.val() || []; // Lấy giá trị của cartData từ snapshot, nếu không tồn tại, trả về một mảng rỗng
      // tìm xem itemID có trong database không
      const findProIndex = await cartData.findIndex(
        (item) => item.ID === itemID
      );
      // tiến hành tạo 1 mảng mới và xóa trong mảng đó. tạo mảng mới để không ảnh hưởng mảng cũ
      if (findProIndex !== -1) {
        // Xóa phần từ có item tương ứng từ mảng cartData
        cartData.splice(findProIndex, 1);
        // Cập nhật dữ liệu mới nhất vào firebase
        await userDataRef.set(cartData);
        res.json({ success: true, newList: cartData });
      } else {
        res.json({ success: false, message: "Item not found in cart" });
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async removeAllFromCart(req, res) {
    // Check if the Authorization header is provided
    console.log(req.headers.authorization);
    if (!req.headers.authorization) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = req.headers.authorization;
    console.log("totken", token);
    try {
      // Check if the token is provided
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "No token provided" });
      }

      const userId = jwt.verify(token, process.env.PRIVATE_KEY_SESSION).userId;

      // Check if the userId is provided
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }

      const userRecordSnapshot = await fb.ref("users").child(userId).get();

      // Check if the user exists
      if (!userRecordSnapshot.exists()) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Update the cartData field to an empty array
      await fb.ref("users").child(userId).update({ cartData: [] });

      return res.json({ success: true, message: "Cart cleared successfully" , newCart:[] });
    } catch (error) {
      console.error("Error removing items from cart:", error);
      return res.status(500).json({
        success: false,
        message: "Could not clear cart",
        error: error.message,
      });
    }
  }
}

module.exports = new CartController();
