const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const fb = require("../database_connection/firebase");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:2905/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      // orderByChild: yêu cầu giá trị cụ thể được định nghĩa bằng key email hoặc đường dẫn lồng nhau
      const response = await fb
        .ref("users")
        .orderByChild("email")
        .equalTo(profile.emails[0].value)
        .once("value");
      if (profile.id) {
        if (!response.exists()) {
          const userRef = fb.ref("users");
          userRef
            .push({
              id: profile.id,
              email: profile.emails[0].value,
              displayName: profile.displayName,
              typeLogin: profile.provider,
            })
        }
      }
      return done(null, profile);
    }
  )
);

// Lưu thông tin người dùng vào session
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

module.exports = passport;
