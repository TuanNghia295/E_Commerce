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
const fb = require("./database_connection/firebase");
const session = require("express-session");

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
  const { email } = req.body;
  try {
    // check email exits in database or not
    // orderByChild: yêu cầu giá trị cụ thể được định nghĩa bằng key email hoặc đường dẫn lồng nhau
    const snapshot = await fb
      .ref("users")
      .orderByChild("email")
      .equalTo(email)
      .once("value");
    if (snapshot.exists()) {
      return res.status(400).json({
        error: "Email has been used",
      });
    } else {
      const userRef = fb.ref("users");
      userRef
        .push({
          email: req.body.email,
          name: req.body.username,
          password: req.body.password,
          cartData: Array.from({ length: 300 }, (_, index) => ({
            id: index + 1 /* các thuộc tính khác của object */,
          })),
        })

        .then((snapshot) => {
          const key = snapshot.key;
          return res.json({
            key,
            success: true,
            email: req.body.email,
            name: req.body.username,
            password: req.body.password,
            cartData: Array.from({ length: 300 }, (_, index) => ({
              id: index + 1 /* các thuộc tính khác của object */,
            })),
          });
        });
    }
  } catch (error) {
    console.log("error from server when trying to sign up", error);
  }
});

// creating for user login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userRef = fb.ref("users");

  userRef.once("value", (snapshot) => {
    if (snapshot.exists()) {
      const users = snapshot.val();
      // Kiểm tra xem có người dùng nào có email và password khớp với yêu cầu đăng nhập hay không
      const userKeys = Object.keys(users);
      const foundUserKey = userKeys.find((userKey) => {
        const userData = users[userKey];
        return userData.email === email && userData.password === password;
      });

      if (foundUserKey) {
        const token = jwt.sign({ userKeys }, "secretKeyCuaNghia", {
          expiresIn: "1h",
        });
        // login success
        res
          .status(200)
          .json({ success: true, message: "Login Successfully", token });
      } else {
        console.log("Không tìm thấy người dùng");
        res
          .status(401)
          .json({ success: false, error: "Email or password invalid" });
      }
    } else {
      console.log("No data available");
      res.status(404).json({ success: false, error: "No data available" });
    }
  });
});

// creating for sign in, sign up by Facebook, Google
// session config to use passport
app.use(
  session({
    secret: "secretKeyCuaNghia",
    resave: false,
    saveUninitialized: true,
  })
);

const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Middleware của Passport
app.use(passport.initialize());
app.use(passport.session());

// Cấu hình serialize và deserialize user
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

require("dotenv").config();

const googleClientId = process.env.CLIENT_ID;
const googleClientSecret = process.env.CLIENT_SECRET;

// Cấu hình Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: "http://localhost:2905/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("accessToken: " + accessToken);
      console.log("refreshToken" + refreshToken);
      console.log("profile" + profile);
      return done(null, profile);
    }
  )
);

// Endpoint đăng nhập bằng tài khoản Google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    // Xử lý sau khi đăng nhập thành công
    res.send(`Hello ${req.user.displayName}!`);
  }
);

// creating endpoint for newCollections data
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let newCollections = products.slice(1).slice(-8);
  // console.log("newCollections", newCollections);
  res.send(newCollections);
});

// creating endpoint for popular in women section
app.get("/popularinwoman", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  // console.log("women fetched", popular_in_women);
  res.send(popular_in_women);
});

// creating middleware to fetch user id
// const fetchUser = async (req, res, next) => {
//   const token = req.header("authToken");
//   if (!token) {
//     res.status(401).send({ errors: "Please authenicate using a valid token" });
//   } else {
//     try {
//       const data = jwt.verify(token, "secretKeyCuaNghia");
//       req.user = data.user;
//       next();
//     } catch (error) {
//       res
//         .status(401)
//         .send({ errors: "Please authenicate using a valid token  " });
//     }
//   }
// };

const fetchUser = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).send({ errors: "Please authenicate using a valid token" });
  } else {
    // verify token
    try {
      const data = jwt.verify(token, "secretKeyCuaNghia");
      req.userId = data.userId;
      console.log(data.userKeys);
      next();
    } catch (error) {
      console.log("error", error);
    }
  }
};

// creating endpoints for addings products in data
app.post("/addtocart", fetchUser, async (req, res) => {
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
});

// creating endpoints to remove products from cartdata
app.post("/removefromcart", fetchUser, async (req, res) => {
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
});

// creating get cartData
// app.post("/getcart", fetchUser, async (req, res) => {
//   console.log("Get cart");
//   let userData = await Users.findOne({ _id: req.user.id });
//   res.json(userData.cartData);
// });

app.post("/getcart", fetchUser, async (req, res) => {
  console.log("Get cart");
  // lấy users data và lặp qua 1 lần để lấy ra giá trị của cart
  fb.ref("users").once("value", (snapshot) => {
    if (snapshot.exists()) {
      const users = snapshot.val();
      const userKeys = Object.keys(users);
      console.log("keys",userKeys);
    }
  });
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server listening on http://localhost:" + port);
  } else {
    console.log("Error: " + error);
  }
});
