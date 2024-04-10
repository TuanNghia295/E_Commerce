const Product = require("../schema/product");

class CollectionsController {
  // creating endpoint for newCollections dnewcollectionsata
  //   GET /collections
  async newcollections(req, res) {
    let products = await Product.find({});
    let newCollections = products.slice(1).slice(-8);
    console.log("newCollections", newCollections);
    res.send(newCollections);
  }

  // creating endpoint for popular in women section
  //   GET /popularinwoman
  async popularinwoman(req, res) {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    // console.log("women fetched", popular_in_women);
    res.send(popular_in_women);
  }
}

module.exports = new CollectionsController();
