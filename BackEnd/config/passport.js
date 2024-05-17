const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const fb = require("../database_connection/firebase");
const User = fb.ref("users");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:2905/auth/google/callback",
      scope: ["profile", "email", "openid"],
      prompt: "consent",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;
        if (!email) {
          return cb(new Error("No email found"), null);
        }

        const userRef = User.child(profile.id);
        const snapshot = await userRef.once("value");
        const existingUser = snapshot.val();

        if (existingUser) {
          // Update user
          await userRef.update({
            displayName: profile.displayName,
            email: email,
            photo:
              profile.photos && profile.photos.length > 0
                ? profile.photos[0].value
                : null,
            provider: profile.provider,
            accessToken,
            refreshToken: refreshToken ? refreshToken : null,
          });
        } else {
          // Create account in Authentication firebase
          admin.auth().createUser({
            uid: profile.id,
            email: profile.emails[0].value,
          });

          // Create new user
          await userRef.set({
            id: profile.id,
            displayName: profile.displayName,
            email: email,
            photo:
              profile.photos && profile.photos.length > 0
                ? profile.photos[0].value
                : null,
            provider: profile.provider,
            accessToken,
            refreshToken: refreshToken ? refreshToken : null,
          });
        }

        // Create JWT token
        const token = jwt.sign(
          { id: profile.id, email: email, displayName: profile.displayName },
          process.env.PRIVATE_KEY_SESSION,
          {
            expiresIn: "1h",
          }
        );

        return cb(null, { profile, token });
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);

// Serialize user to save into session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
