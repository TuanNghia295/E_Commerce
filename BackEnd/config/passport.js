const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const fb = require("../database_connection/firebase");
// Serialize user into the session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(function (id, done) {
  fb.ref("users")
    .orderByChild("id")
    .equalTo(id)
    .once("value", function (snapshot) {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const userKey = Object.keys(userData)[0];
        done(null, userData[userKey]);
      } else {
        done(new Error("User not found: " + id));
      }
    });
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        console.log(profile);
        const response = await fb
          .ref("users")
          .orderByChild("email")
          .equalTo(profile.emails[0].value)
          .once("value");
        const userRef = fb.ref("users");
        if (!response.exists()) {
          await userRef.push({
            id: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName,
            typeLogin: profile.provider,
          });
        } else {
          // Update user information if needed
          const userKey = Object.keys(response.val())[0];
          await userRef.child(userKey).update({
            displayName: profile.displayName,
            typeLogin: profile.provider,
          });
        }
        return done(null, profile);
      } catch (error) {
        console.error(error);
        return done(error);
      }
    }
  )
);

module.exports = passport;
