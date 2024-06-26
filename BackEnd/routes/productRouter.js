const express = require("express");
const router = express.Router();

const ProdcutController = require("../controllers/ProductController");
const ProductController = require("../controllers/ProductController");
router.get("/", ProdcutController.allProducts);
router.post("/addProduct",ProductController.addProduct)
router.post("/removeProduct",ProductController.removeProduct)
router.put("/update/:id",ProductController.updateProduct)
router.get("/:id",ProductController.getProduct)
module.exports = router
