import { createContext, useEffect, useState } from "react";
export const ShopContext = createContext(null);

// Cart mặc định với tất cả sản phẩm ở đây sẽ có giá trị là 0
const getDefaultCart = () => {
  let cart = {};
  for (let index = 1; index <= 300; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [all_product, setAllProduct] = useState([]);

  useEffect(() => {
    fetch("http://localhost:2905/allProducts")
      .then((response) => response.json())
      .then((data) => setAllProduct(data));

    if (localStorage.getItem("authToken")) {
      fetch("http://localhost:2905/getcart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          authToken: `${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: "",
      })
        .then((response) => response.json())
        .then((data) => setCartItems(data));
    }
  }, []);

  const addToCart = (itemID) => {
    setCartItems((prev) => ({ ...prev, [itemID]: prev[itemID] + 1 }));
    if (localStorage.getItem("authToken")) {
      fetch("http://localhost:2905/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/data",
          authToken: `${localStorage.getItem("authToken")}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ itemID: itemID }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  };

  const removeFromCart = (itemID) => {
    setCartItems((prev) => ({ ...prev, [itemID]: prev[itemID] - 1 }));
    if (localStorage.getItem("authToken")) {
      fetch("http://localhost:2905/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/data",
          authToken: `${localStorage.getItem("authToken")}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ itemID: itemID }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  };

  const getTotalCartAmount = () => {
    // tạo 1 biến để lưu trữ tổng số tiền
    let totalAmount = 0;
    // tạo 1 vòng lặp để lặp qua object cartItems
    // để kiểm tra xem nếu quantity của item đó lớn hơn 0 thì
    // lấy ra số lượng của sản phẩm đó để nhân với giá tiền
    for (const i in cartItems) {
      if (cartItems[i] > 0) {
        let itemInfo = all_product.find((product) => product.id === Number(i));
        totalAmount += itemInfo.new_price * cartItems[i];
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        // nếu như giá trị của carItems lớn hơn 0
        // Lấy giá trị đó cộng lại
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
