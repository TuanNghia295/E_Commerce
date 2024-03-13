import classNames from "classnames/bind";
import styles from "./CartItems.module.scss";
import { useContext } from "react";
import { ShopContext } from "../../context/ShopContext";
import remove_icon from "../assets/Ecommerce_Frontend_Assets/Assets/cart_cross_icon.png";
const cx = classNames.bind(styles);
const CartItems = () => {
  const { all_product, cartItems,getTotalCartAmount, removeFromCart } =
    useContext(ShopContext);

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
        {all_product.map((item, index) => {
          if (cartItems[item.id] > 0) {
            return (
              <>
                <hr />
                <div  className={cx("cartItems-format",{"cartItems-format-main":true})} key={index}>
                  <img
                    src={item.image}
                    alt=""
                    className={cx("cartIcon-product-icon")}
                  />
                  <p>{item.name}</p>
                  <p>${item.new_price}</p>
                  <button className={cx("cartItem-quantity")}>
                    {cartItems[item.id]}
                  </button>
                  <p>${item.new_price * cartItems[item.id]}</p>
                  <img
                    src={remove_icon}
                    onClick={() => removeFromCart(item.id)}
                    alt=""
                    className={cx("cartItems-remove-icon")}
                  />
                </div>
              </>
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
