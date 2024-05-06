import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import ShopContextProvider from "./context/ShopContext.jsx";

ReactDOM.render(
    <ShopContextProvider>
        <App />
    </ShopContextProvider>,
  document.getElementById("root")
);