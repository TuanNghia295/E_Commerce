import classNames from "classnames/bind";
import styles from "./CartItems.module.scss";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import remove_icon from "../assets/Ecommerce_Frontend_Assets/Assets/cart_cross_icon.png";
const cx = classNames.bind(styles);
const CartItems = () => {
  const { all_product, cartItems, getTotalCartAmount, removeFromCart } =
    useContext(ShopContext);
  const [list, setList] = useState([]);

  useEffect(() => {
    const newList = [];
    if (cartItems === undefined) {
      setList(newList);
    } else {
      // kiểm tra xem pro_code có trùng với ID không
      // nếu trùng thì spread vào setList thông tin trong allProduct
      for (const i in cartItems) {
        const list = all_product.find(
          (item) => item.pro_code === cartItems[i].ID
        );
        if (list) {
          newList.push(list);
        }
      }
      setList(newList);
      console.log("list", list);
    }
  }, [cartItems]);

  return (
    <div className={cx("cartItems")}>
      <div className={cx("cartItems-format-main")}>
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <div>
        {list.map((item, index) => {
          if (cartItems.length > 0) {
            return (
              <div key={index}>
                <hr />
                <div
                  className={cx("cartItems-format", {
                    "cartItems-format-main": true,
                  })}
                >
                  <img
                    src={item.image.replace(";", "")}
                    alt=""
                    className={cx("cartIcon-product-icon")}
                  />
                  <p>{item.name}</p>
                  <p>${item.new_price}</p>
                  <button className={cx("cartItem-quantity")}>
                    {cartItems.map((pro) => {
                      if (pro.ID === item.pro_code) {
                        return pro.quantity;
                      }
                    })}
                  </button>
                  <p>
                    $
                    {cartItems.map((pro) => {
                      if (pro.ID === item.pro_code) {
                        return pro.quantity * item.new_price;
                      }
                    })}
                  </p>
                  <img
                    src={remove_icon}
                    onClick={() => removeFromCart(item.pro_code)}
                    alt=""
                    className={cx("cartItems-remove-icon")}
                  />
                </div>
              </div>
            );
          }
          return null;
        })}
        <div className={cx("cartItems-down")}>
          <div className={cx("cartItems-total")}>
            <h1>Cart Totals</h1>
            <div>
              <div className={cx("cartItems-total-item")}>
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className={cx("cartItems-total-item")}>
                <p>Shipping fee</p>
                <p>Free</p>
              </div>
              <hr />
              <div className={cx("cartItems-total-item")}>
                <h3>Total</h3>
                <h3>${getTotalCartAmount()}</h3>
              </div>
            </div>

            <button>PROCEED TO CHECKOUT</button>
          </div>
          <div className={cx("cartItems-promocode")}>
            <p>If you have promo code, Enter it here</p>
            <div className={cx("cartItems-promobox")}>
              <input type="text" placeholder="promo code" name="" id="" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
