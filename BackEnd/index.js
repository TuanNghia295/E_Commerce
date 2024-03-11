const port = 2905;
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const Product = require("./schema/product");
const Users = require("./schema/user");
const db = require("./database_connection/index");

app.use(express.json());
app.use(cors());

// Database connection with mogoDB
const username = "tuannghiait2905";
const password = "panda2905";
db.Connect(username, password);

// API creation

app.get("/", (req, res) => {
  res.send("Express App is running");
});

// Imgaes storage engine
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

// creating upload endpoint for images
// Middleware upload.single("product") sẽ xử lý việc tải lên một tệp tin
// và tệp tin này sẽ được gán vào trường có tên là "product" trong yêu cầu (req).

app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res, next) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// Schema for creating product
app.post("/addProduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    // lấy ra phần tử cuối cùng trong mảng products
    let last_product_in_array = products.slice(-1);
    //   Gán phần tử cuối cùng vào biến mới
    let last_product = last_product_in_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// creating API for deleting products
app.post("/removeProduct", async (req, res, next) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Creating API for getting all products
app.get("/allProducts", async (req, res, next) => {
  let products = await Product.find({});
  res.send(products);
});

// Creating endpoint for registering the users
app.post("/signUp", async (req, res, next) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      error: "Existing user found with same email address",
    });
  }
  let cart = {};
  // tạo cart rỗng có  key và value có thứ tự từ 1 đến 300 có giá trị bằng 0
  for (let index = 1; index <= 300; index++) {
    cart[index] = 0;
  }

  const user = new Users({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };

  //  sử dụng jwt để tạo token
  // lấy data có dữ liệu là ID để đăng ký
  const token = jwt.sign(data, "secretKeyCuaNghia");
  //  // tạo nameCookie
  // const cookieName = "AuthToken";
  // const valueToken = token;
  // const timeExpiresIn = 60 * 60 * 60 * 100 * 24;
  // const cookiee = res.cookie(cookieName, valueToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite:"strict",
  //   maxTime: timeExpiresIn,
  //   success: true,
  //   token,
  // });
  res.json({
    success: true,
    token
  });
});

// creating for user login
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(data, "secretKeyCuaNghia", {});
      return res.json({
        success: true,
        token,
      });
    } else {
      return res.json({ success: false, error: "Wrong Password" });
    }
  }
  return res.json({ success: false, error: "Wrong Email ID" });
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server listening on http://localhost:" + port);
  } else {
    console.log("Error: " + error);
  }
});
