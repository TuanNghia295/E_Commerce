const mongoose = require("mongoose");
function Connect(username, password) {
  return mongoose.connect(
    `mongodb+srv://${username}:${password}@cluster0.g8sgynn.mongodb.net/Ecommerce`
  );
}

module.exports = { Connect };
