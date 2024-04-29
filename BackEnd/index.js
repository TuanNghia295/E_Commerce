const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const db = require("./database_connection/index");
const fb = require("./database_connection/firebase");
const session = require("express-session");
const router = require("./routes/authRouter");
const cookieSession = require("cookie-session");
const passport = require("passport");
const routes = require("./routes");
const admin = require("firebase-admin");
var cookieParser = require("cookie-parser");
require("dotenv").config();
require("./config/passport");
let port = 2905;

app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.PRIVATE_KEY_SESSION],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(cookieParser());

passport.initialize();
passport.session();

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

// API creation

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

    if (!userData || !userData.userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid user data",
      });
    }

    console.log("userData: ", userData.userId);

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

    // Trả về phản hồi thành công cho client
    res.status(200).json({
      success: true,
      message: "Received user data successfully",
      userData,
      dbData,
      token
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

// creating for sign in, sign up by Facebook, Google
// session config to use passport
app.use(
  session({
    secret: "secretKeyCuaNghia",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/", router);

app.listen(port, (error) => {
  if (!error) {
    console.log("Server listening on http://localhost:" + port);
  } else {
    console.log("Error: " + error);
  }
});
