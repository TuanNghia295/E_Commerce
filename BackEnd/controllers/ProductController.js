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
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
      // lấy ra phần tử cuối cùng trong mảng products
      let last_product_in_array = products.slice(-1);
      //   Gán phần tử cuối cùng vào biến mới
      let last_product = last_product_in_array[0];
      id = last_product.id + 1;
    } else {
      id = 1;
    }
    const product = new Product({
      id: id,
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
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("removed");
    res.json({
      success: true,
      name: req.body.name,
    });
  }
}

module.exports = new ProductController();
