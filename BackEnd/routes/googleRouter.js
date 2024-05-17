const express = require("express");
const router = express.Router();
const passport = require("../config/passport");

const googleController = require("../controllers/GoogleController");
router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email", "openid"] })
);
router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleController.authenticateCallback
);

module.exports = router;
