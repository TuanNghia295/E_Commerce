const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const db = require("./database_connection/index");
const fb = require("./database_connection/firebase");
const session = require("express-session");
const router = require("./routes/authRouter");
const passport = require("./config/passport");
const routes = require("./routes");
const admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const authMiddleware = require("./middleWare/auth");

require("dotenv").config();
require("./config/passport");
let port = 2905;

app.use(express.json());
app.use(cookieParser());

// Khởi tạo passport và session
passport.initialize();
passport.session();

app.use(
  session({
    secret: process.env.PRIVATE_KEY_SESSION,
    resave: false,
    saveUninitialized: true,
  })
);

const whiteList = [process.env.URL_CLIENT.split(",").map((url) => url.trim())];
app.use(
  cors({
    origin: whiteList,
    credentials: true, // Cho phép gửi cookie cross-origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Cho phép sử dụng các phương thức HTTP cụ thể
    allowedHeaders: ["Content-Type", "Authorization", "authtoken"], // Cho phép sử dụng các header cụ thể
    preflightContinue: false, // Tắt preflight caching
    optionsSuccessStatus: 204, // Set mã status thành công cho các yêu cầu OPTIONS
  })
);

routes(app);

// Database connection with mogoDB
const username = "tuannghiait2905";
const password = "panda2905";
db.Connect(username, password);

// START API OAUTH
app.get("/refresh-token", authMiddleware, async (req, res) => {
  // Kiểm tra req được xác thực hay không
  if (req.isAuthenticated()) {
    // Lấy ra id của user ở profile
    const userId = req.user.profile.id;
    // Lấy ra user trong database bằng userId
    const userRef = fb.ref("users").child(userId);
    // Đọc dữ liệu
    const snapshot = await userRef.once("value");
    // Lấy dữ liệu
    const userData = snapshot.val();

    // Kiểm tra xem userData có tồn tại hay không
    if (userData) {
      // sử dụng refresh token để lấy token mới từ google
      const refreshToken = userData.refreshToken;

      // cấu hình dữ liệu để chuẩn bị gửi tới google
      const data = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      };

      // POST đến google để lấy được accessToken mới
      const response = axios.post("https://oauth2.googleapis.com/token", data);
      const new_accessToken = response.access_token;

      // Cập nhật accessToken mới vào database
      await userRef.update({ accessToken: new_accessToken });

      // Tạo JWT mới
      const newToken = jwt.sign(
        { id: userId, email: userData.email },
        process.env.PRIVATE_KEY_SESSION,
        { expiresIn: "1h" }
      );
      res.json({ success: true, token: newToken });
    }
  }
});
// END

app.get("/", (req, res) => {
  res.send("Express App is running");
});

app.use("/images", express.static("upload/images"));

// Creating endpoint for registering the users
// app.post("/signUp", async (req, res, next) => {
//   const { email } = req.body;
//   try {
//     const snapshot = await fb
//       .ref("users")
//       .orderByChild("email")
//       .equalTo(email)
//       .once("value");

//     if (snapshot.exists()) {
//       return res.status(400).json({
//         error: "Email đã được sử dụng",
//       });
//     } else {
//       const userRef = fb.ref("users");
//       userRef
//         .push({
//           email: req.body.email,
//           name: req.body.username,
//           password: req.body.password,
//           cartData: [], // Đảm bảo cartData là một mảng rỗng
//           date: Date.now(),
//         })
//         .then((snapshot) => {
//           const key = snapshot.key;

//           const payload = {
//             userId: key,
//           };
//           const token = jwt.sign(payload, process.env.PRIVATE_KEY_SESSION, {
//             expiresIn: "1h",
//           });

//           // Bao gồm cartData trong phản hồi
//           return res.json({
//             key,
//             token,
//             success: true,
//             email: req.body.email,
//             name: req.body.username,
//             password: req.body.password,
//             cartData: [], // Bao gồm cartData trong phản hồi
//           });
//         })
//         .catch((error) => {
//           console.error("Lỗi khi tạo người dùng:", error);
//           return res.status(500).json({
//             error: "Lỗi khi tạo người dùng",
//           });
//         });
//     }
//   } catch (error) {
//     console.error("Lỗi khi kiểm tra email:", error);
//     return res.status(500).json({
//       error: "Lỗi khi kiểm tra email",
//     });
//   }
// });

// creating for user login
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const userRef = fb.ref("users");

//   userRef.once("value", (snapshot) => {
//     if (snapshot.exists()) {
//       const users = snapshot.val();
//       // Kiểm tra xem có người dùng nào có email và password khớp với yêu cầu đăng nhập hay không
//       const userKeys = Object.keys(users);
//       const foundUserKey = userKeys.find((userKey) => {
//         const userData = users[userKey];
//         return userData.email === email && userData.password === password;
//       });

//       if (foundUserKey) {
//         const token = jwt.sign(
//           { userId: foundUserKey },
//           process.env.PRIVATE_KEY_SESSION,
//           {
//             expiresIn: "1h",
//           }
//         );
//         // login success
//         res
//           .status(200)
//           .json({ success: true, message: "Login Successfully", token });
//       } else {
//         console.log("Không tìm thấy người dùng");
//         res
//           .status(401)
//           .json({ success: false, error: "Email or password invalid" });
//       }
//     } else {
//       console.log("No data available");
//       res.status(404).json({ success: false, error: "No data available" });
//     }
//   });
// });

app.post("/signUp", async (req, res, next) => {
  try {
    // receive data sent to server by the client
    const { email, password, displayName } = req.body.userData;

    // Check if data is complete
    if (!email || !password || !displayName) {
      return res.status(400).json({
        success: false,
        message: "Incomplete data",
      });
    }

    // create account at firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    // create user data at firebase Realtime Database
    const creatUserData = await fb.ref("users").child(userRecord.uid).set({
      email,
      displayName,
      cartData: [],
    });

    // If creating user data failed, send error response to client
    if (creatUserData === false) {
      throw new Error("Failed to create user data");
    }

    // response to client
    res.status(200).json({
      success: true,
      message: "User account created successfully",
    });
  } catch (error) {
    console.log("Error creating account:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user account",
      error: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const userData = req.body.userData;
    console.log("userData", userData);
    if (!userData || !userData.userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid user data",
      });
    }
    // check exist user data
    const snapshot = await fb.ref("users").child(userData.userId).once("value");

    const dbData = snapshot.val();

    if (!dbData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // tạo token jwt
    const token = jwt.sign(
      { userId: userData.userId },
      process.env.PRIVATE_KEY_SESSION,
      { expiresIn: "1h" }
    );

    // lưu token vào database
    await fb.ref("users").child(userData.userId).update({ token });
    // kiểm tra coi có phải tài khoản admin không trên authentication firebase
    if (dbData.role === "admin") {
      return res.json({
        success: true,
        isAdmin: true,
        token,
        message: "welcome admin !",
      });
    }
    // Trả về phản hồi thành công cho client
    res.status(200).json({
      success: true,
      message: "login successfully",
      token,
    });
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({
      success: false,
      message: "Failed to query database",
      error: error.message,
    });
  }
});

app.get("/userInfo", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const userId = jwt.verify(token, process.env.PRIVATE_KEY_SESSION).userId;
  const snapshot = await fb.ref("users").child(userId).once("value");
  const userData = snapshot.val();
  res.status(200).json(userData);
});

app.use("/", router);

app.listen(port, (error) => {
  if (!error) {
    console.log("Server listening on http://localhost:" + port);
  } else {
    console.log("Error: " + error);
  }
});
