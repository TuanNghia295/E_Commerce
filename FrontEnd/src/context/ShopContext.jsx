import { createContext, useEffect, useState } from "react";
export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const [all_product, setAllProduct] = useState([]);

  // biến kiểm tra trạng thái token
  const [tokenExpired,setTokenExpired] = useState(false)

  // hàm kiểm tra token hết hạn hay chưa
  const isTokenExpired = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return true;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp < Date.now() / 1000;
  };
  useEffect(() => {
    if (isTokenExpired()) {
      localStorage.removeItem("authToken");
      setTokenExpired(true)
    } else {
      fetch("http://localhost:2905/allProducts")
        .then((response) => response.json())
        .then((data) => setAllProduct(data));

      const token = localStorage.getItem("authToken");
      // use currentUser method to get current user information
      if (token) {
        fetch("http://localhost:2905/cart/getcart", {
          method: "POST",
          headers: {
            Accept: "application/form-data",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: "",
        })
          .then((response) => response.json())
          .then((data) => setCartItems(data.cartData));
      }
    }
  }, []);

  const addToCart = async (itemID) => {
    if (localStorage.getItem("authToken")) {
      await fetch("http://localhost:2905/cart/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/data",
          Authorization: `${localStorage.getItem("authToken")}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ itemID: itemID }),
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          if (data.success && data.existed) {
            const update = data.update;
            const findItems = cartItems.map((item) => {
              if (item.ID === update.ID) {
                item.quantity = update.quantity;
              }
              return item;
            });
            setCartItems(findItems);
          } else if (data.success && !data.existed) {
            if (!cartItems) {
              setCartItems([data.update]); // Khởi tạo mảng mới nếu cartItems chưa tồn tại
            } else {
              setCartItems([...cartItems, { ...data.update }]); // Thêm data.update vào mảng cartItems sử dụng spread
            }
          } else {
            alert("Can not add item into cart");
          }
        });
    }
  };

  const removeFromCart = async (itemID) => {
    // setCartItems((prev) => ({ ...prev, [itemID]: prev[itemID] - 1 }));
    if (localStorage.getItem("authToken")) {
      await fetch("http://localhost:2905/cart/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/data",
          Authorization: `${localStorage.getItem("authToken")}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ itemID: itemID }),
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log("data", data);
          if (data.success) {
            // Kiểm tra xem newList có rỗng không trước khi cập nhật cartItems
            if (data.newList && data.newList.length > 0) {
              setCartItems(data.newList);
            } else {
              setCartItems([]);
            }
          }
        });
    }
  };

  const getTotalCartAmount = () => {
    if (!cartItems) {
      return 0;
    }
    // Sử dụng phương thức map() để tạo một mảng mới chứa giá trị tổng tiền của từng sản phẩm trong cartItems
    const totalAmounts = cartItems.map((cartItem) => {
      // Tìm sản phẩm có mã trùng với ID của cartItem trong danh sách sản phẩm
      const foundProduct = all_product.find(
        (product) => product.pro_code === cartItem.ID
      );

      // Nếu tìm thấy sản phẩm và số lượng không âm
      if (foundProduct && cartItem.quantity > 0) {
        // Trả về giá trị tổng tiền cho sản phẩm đó
        return foundProduct.new_price * cartItem.quantity;
      } else {
        // Nếu không tìm thấy sản phẩm hoặc số lượng âm, trả về 0
        return 0;
      }
    });

    // Tính tổng của tất cả các giá trị tổng tiền trong mảng totalAmounts
    const totalAmount = totalAmounts.reduce((acc, curr) => acc + curr, 0);

    // Trả về tổng tiền
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let total = 0;
    let addedProductIds = {};

    for (const i in cartItems) {
      if (cartItems[i].quantity > 0 && !addedProductIds[cartItems[i].ID]) {
        total += 1;
        addedProductIds[cartItems[i].ID] = true;
      }
    }

    return total;
  };

  const contextValue = {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
    tokenExpired
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
