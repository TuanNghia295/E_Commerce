const Product = require("../schema/product");

class ProductController {
  // Creating API for getting all products
  // GET /allProducts
  async allProducts(req, res, next) {
    let products = await Product.find({});
    res.send(products);
  }

  // Schema for creating product
  // POST /addProduct
  async addProduct(req, res) {
    const product = new Product({
      pro_code: req.body.pro_code,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("saved");
    res.json({
      success: true,
      name: req.body.name,
    });
  }

  // creating API for deleting products
  async removeProduct(req, res, next) {
    await Product.findOneAndDelete({ pro_code: req.body.pro_code});
    console.log("removed");
    res.json({
      success: true,
      name: req.body.name,
    });
  }
}

module.exports = new ProductController();
