const uploadRouter = require("./uploadRouter");
const productRouter = require("./productRouter");
const collections = require("./collectionsRouter");
const cart = require("./cartRouter");
const update = require("./updateRouter");
const googleRouter = require("./googleRouter");
function routes(app) {
  app.use("/upload", uploadRouter);
  app.use("/allProducts",productRouter)
  app.use("/newcollections",collections)
  app.use("/cart",cart)
  app.use("/update",update)
  app.use("/auth/google",googleRouter)
}

module.exports = routes;
