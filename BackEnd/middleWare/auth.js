require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretKey = process.env.PRIVATE_KEY_SESSION;

module.exports = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided" });

  //   Xác thực token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    req.user = decoded;
    next();
  });
};
