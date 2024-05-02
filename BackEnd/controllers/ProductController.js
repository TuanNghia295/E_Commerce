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
    const productInfo = req.body;
    // kiểm tra pro_code coi có tồn tại chưa
    let productExistCheck = await Product.findOne({
      $or: [{ _id: req.body.id }, { pro_code: req.body.pro_code }],
    });

    if (productExistCheck) {
      // nếu tồn tại thì thêm thêm size và quantity được thêm mới vào
      productExistCheck.size.push(productInfo.size);
      productExistCheck.quantity =
        Number(productExistCheck.quantity) + Number(productInfo.quantity);
    } else {
      productExistCheck = new Product({
        pro_code: productInfo.pro_code,
        name: productInfo.name,
        image: productInfo.image,
        category: productInfo.category,
        new_price: productInfo.new_price,
        old_price: productInfo.old_price,
        quantity: productInfo.quantity,
        description: productInfo.description,
        color: productInfo.color,
        size: productInfo.size,
      });
    }

    console.log(productExistCheck);
    await productExistCheck.save();
    console.log("saved");
    res.json({
      success: true,
      name: req.body.name,
    });
  }

  // creating API for deleting products
  async removeProduct(req, res, next) {
    await Product.findOneAndDelete({ pro_code: req.body.pro_code });
    console.log("removed");
    res.json({
      success: true,
      name: req.body.name,
    });
  }
}

module.exports = new ProductController();
