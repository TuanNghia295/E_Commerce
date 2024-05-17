class GoogleController {
  // GET /auth/google/callback
  authenticateCallback(req, res) {
    const token = req.user.token;
    // use cookies send token to client
    res.cookie("authToken", token, { httpOnly: true, secure: true });

    // Successful authentication, redirect home.
    res.redirect(`http://localhost:5173`);
  }
}

module.exports = new GoogleController();
