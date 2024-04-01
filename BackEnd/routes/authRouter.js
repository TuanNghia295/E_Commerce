const router = require("express").Router();
const passport = require("passport");
require("dotenv").config();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, profile) => {
    req.user = profile;
    next();
  })(req, res, next);
}
,(req, res, next) => {
  res.redirect(`${process.env.URL_CLIENT}/${req.user.id}`)
});

router.post("/", (req, res) => {
  res.send("succ");
});

module.exports = router;
