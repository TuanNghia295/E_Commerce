const fb = require("../database_connection/firebase");
const Users = fb.ref("users");

class CartController {
  // POST /cart/getcart
  async getcart(req, res) {
    const userId = req.userId;
    console.log("Get cart");
    console.log("CarId: \n",userId);
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
    console.log("added", req.body.itemID);

    let userData = await Users.findOne({
      _id: req.user.id,
    });
    userData.cartData[req.body.itemID] += 1;
    await Users.findOneAndUpdate(
      {
        _id: req.user.id,
      },
      {
        cartData: userData.cartData,
      }
    );
    res.send("Added");
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
