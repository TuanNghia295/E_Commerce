const fb = require("../database_connection/firebase");
const Users = fb.ref("users");

class CartController {
  // POST /cart/getcart
  async getcart(req, res) {
    const userId = req.userId;
    console.log("Get cart");
    console.log("CarId: \n", userId);
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
    console.log("itemId: ", itemID);

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
      res.json({ success: true, product_exist: findExistingProduct });
    } else {
      const newProduct = {
        ID: itemID,
        quantity: 1,
      };
      cartData.push(newProduct);
      //  lưu cartData vào firebase sau khi thêm sản phẩm
      await userDataRef.set(cartData);
      res.json({ success: true, added_product: newProduct });
    }
  }

  //   POST /cart/removefromcart
  // creating endpoints to remove products from cartdata
  async removefromcart(req, res) {
    console.log("remove", req.body.itemID);
    let userData = await Users.findOne({
      _id: req.user.id,
    });
    if (userData.cartData[req.body.itemID] > 0) {
      userData.cartData[req.body.itemID] -= 1;
    }
    await Users.findOneAndUpdate(
      {
        _id: req.user.id,
      },
      {
        cartData: userData.cartData,
      }
    );
    res.send("Removed");
  }
}

module.exports = new CartController();
