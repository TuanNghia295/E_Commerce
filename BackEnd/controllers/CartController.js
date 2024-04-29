const fb = require("../database_connection/firebase");

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
    const { itemID } = req.body;

    // Thực hiện truy vấn để lấy dữ liệu từ Firebase Realtime Database
    const userDataRef = fb.ref("users").child(userId).child("cartData");
    const snapshot = await userDataRef.once("value");
    let cartData = snapshot.val() || []; // Lấy giá trị của cartData từ snapshot, nếu không tồn tại, trả về một mảng rỗng

    // Thêm một giá trị mới vào mảng cartData
    const findExistingProduct = cartData.find((item) => item.ID === itemID);
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
        ID: itemID,
        quantity: 1,
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
}

module.exports = new CartController();
