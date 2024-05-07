const router = require("express").Router();
const passport = require("passport");
const fb = require("../database_connection/firebase");
require("dotenv").config();
const jwt = require('jsonwebtoken');

const saveToDatabase = async (profile) => {
  const userRecord = fb.ref("users");
  // check if user is already exists
  const snapshot = await userRecord.child(profile.id).once("value");
  if (snapshot.exists()) {
    return snapshot.val();
  }

  await userRecord.child(profile.id).set(profile);
  return profile;
};

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    // Successful authentication, redirect home.
    let user;
    try {
      user = await saveToDatabase(req.user);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }

    const token = jwt.sign({ id: user.id }, process.env.PRIVATE_KEY_SESSION);
    res.redirect(`${process.env.URL_CLIENT}?token=${token}`);
  }
);

module.exports = router;