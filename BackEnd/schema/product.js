const mongoose = require("mongoose");

const Product = mongoose.model("Product", {
  pro_code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: [String],
    required: true,
  },
  // available: {
  //   type: Boolean,
  //   default: true,
  // },
});

module.exports = Product;
