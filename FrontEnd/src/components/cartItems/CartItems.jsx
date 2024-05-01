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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullname: "",
    phone: "",
    address: "",
    promocode: "",
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toogleRemoveModal = () => {
    setIsRemoveModalOpen(!isRemoveModalOpen);
  };

  const handleInputChange = (event) => {
    setUserInfo({ ...userInfo, [event.target.name]: event.target.value });
  };
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
                  <p>${item.new_price.toLocaleString()}</p>
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
                        return (pro.quantity * item.new_price).toLocaleString();
                      }
                    })}
                  </p>
                  <img
                    src={remove_icon}
                    onClick={toogleRemoveModal}
                    // onClick={() =>
                    alt=""
                    className={cx("cartItems-remove-icon")}
                  />
                </div>
                {isRemoveModalOpen && (
                  <>
                    <div
                      className={cx("cartItems-modal-overlay")}
                      onClick={toogleRemoveModal}
                    ></div>
                    <div className={cx("cartItems-modal")}>
                      <h2>ARE YOU SURE ?</h2>
                      <div className={cx("cartItems-modal-box")}>
                        <div className={cx("cartItems-modal-button")}>
                          <div
                            className={cx("buy-btn")}
                            onClick={() => {
                              removeFromCart(item.pro_code);
                              toogleRemoveModal();
                            }}
                          >
                            DELETE
                          </div>
                        </div>
                        <div className={cx("cartItems-modal-button")}>
                          <div
                            className={cx("cancel-btn")}
                            onClick={toogleRemoveModal}
                          >
                            CANCEL
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
                <p>Full Name</p>
                <p>{userInfo.fullname}</p>
              </div>
              <hr />

              <div className={cx("cartItems-total-item")}>
                <p>Phone Number</p>
                <p>{userInfo.phone}</p>
              </div>
              <hr />

              <div className={cx("cartItems-total-item")}>
                <p>Address</p>
                <p>{userInfo.address}</p>
              </div>
              <hr />
              <div className={cx("cartItems-total-item")}>
                <p>Subtotal</p>
                <p>${getTotalCartAmount().toLocaleString()}</p>
              </div>
              <hr />
              <div className={cx("cartItems-total-item")}>
                <p>Shipping fee</p>
                <p>Free</p>
              </div>
              <hr />
              <div className={cx("cartItems-total-item")}>
                <h3>Total</h3>
                <h3>${getTotalCartAmount().toLocaleString()}</h3>
              </div>
            </div>
            <button onClick={toggleModal} className={cx("proceed-btn")}>
              PROCEED TO CHECKOUT
            </button>
          </div>
          <div className={cx("cartItems-information")}>
            <h1>Information</h1>
            <div className={cx("cartItems-infobox")}>
              <input
                type="text"
                placeholder="Full Name"
                name="fullname"
                id="fullname"
                value={userInfo.fullname}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Phone Number"
                name="phone"
                id="phone"
                value={userInfo.phone}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Address"
                name="address"
                id="address"
                value={userInfo.address}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Promo Code (optional)"
                name="promocode"
                id="promocode"
                value={userInfo.promocode}
                onChange={handleInputChange}
              />
              <button>Submit</button>
            </div>
          </div>
          {isModalOpen && (
            <>
              <div
                className={cx("cartItems-modal-overlay")}
                onClick={toggleModal}
              ></div>
              <div className={cx("cartItems-modal")}>
                <h2>ORDER CONFIRMATION</h2>
                <div className={cx("cartItems-modal-box")}>
                  <div className={cx("cartItems-modal-button")}>
                    <div className={cx("buy-btn")}>BUY</div>
                  </div>
                  <div className={cx("cartItems-modal-button")}>
                    <div className={cx("cancel-btn")} onClick={toggleModal}>
                      CANCEL
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItems;
