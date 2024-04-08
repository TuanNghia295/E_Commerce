const uploadRouter = require("./uploadRouter");
const productRouter = require("./productRouter");
const collections = require("./collectionsRouter");
const cart = require("./cartRouter");
function routes(app) {
  app.use("/upload", uploadRouter);
  app.use("/allProducts",productRouter)
  app.use("/newcollections",collections)
  app.use("/cart",cart)
}

module.exports = routes;
