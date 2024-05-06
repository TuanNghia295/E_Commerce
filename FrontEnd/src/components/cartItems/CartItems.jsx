import classNames from "classnames/bind";
import styles from "./CartItems.module.scss";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import remove_icon from "../assets/Ecommerce_Frontend_Assets/Assets/cart_cross_icon.png";
import { PayPalButton } from "react-paypal-button-v2";
const cx = classNames.bind(styles);
const CartItems = () => {
  const {
    all_product,
    cartItems,
    removeAllFromCart,
    getTotalCartAmount,
    removeFromCart,
    user,
  } = useContext(ShopContext);
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onlineBtn, setOnlineBtn] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const toggleModal = () => {
    if (!paymentMethod) {
      alert("Please select a payment method before ordering.");
    } else {
      setIsModalOpen(!isModalOpen);
    }
  };

  const toogleRemoveModal = () => {
    setIsRemoveModalOpen(!isRemoveModalOpen);
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

  //  hàm addPaypalScript
  const addPaypalScript = async () => {
    const response = await fetch("http://localhost:2905/payment/config");
    const data = await response.json();
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${data.data}`;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!window.paypal) {
      addPaypalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  const onSuccessPayPal = (details, data) => {
    alert("Order successfully");
  };

  // hàm xử lý việc đặt hàng trả bằng tiền mặt
  const payByCash = async () => {
    console.log("Cart", cartItems);
    const token = localStorage.getItem("authToken");
    if (token) {
      const response = await fetch("http://localhost:2905/payment/cash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartItems),
      });
      const data = await response.json();
      if (data.success) {
        console.log("scuees");
        alert("Order successfully");
        setIsModalOpen(false);
        await removeAllFromCart();
        window.location.href=("/");
      }
    }
  };

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
          {user ? (
            <div className={cx("cartItems-total")}>
              <h1>Cart Totals</h1>
              <div>
                <div className={cx("cartItems-total-item")}>
                  <p>Full Name</p>
                  <p>{user.fullName}</p>
                </div>
                <hr />

                <div className={cx("cartItems-total-item")}>
                  <p>Phone Number</p>
                  <p>{user.phoneNumber}</p>
                </div>
                <hr />

                <div className={cx("cartItems-total-item")}>
                  <p>Address</p>
                  <p>{user.address}</p>
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
              <div className={cx("cartItems-total-item")}>
                <p>Payment Method</p>
                <div className={cx("payment-options")}>
                  <input
                    className={cx("payment-options-btn")}
                    type="radio"
                    id="payOnDelivery"
                    name="paymentMethod"
                    value="Pay on Delivery"
                    onClick={() => {
                      setOnlineBtn(false);
                      setPaymentMethod("Pay on Delivery");
                    }}
                  />
                  <input
                    className={cx("payment-options-btn")}
                    type="radio"
                    id="payOnline"
                    name="paymentMethod"
                    onClick={() => {
                      setOnlineBtn(true);
                      setPaymentMethod("Pay Online");
                    }}
                    value="Pay Online"
                  />
                  <label htmlFor="payOnline">Pay Online</label>
                </div>
              </div>
              <hr />

              {onlineBtn === true && sdkReady ? (
                <div style={{ maxWidth: "262px" }}>
                  <PayPalButton
                    amount={getTotalCartAmount()}
                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                    onSuccess={onSuccessPayPal}
                    onError={(error) => {
                      alert("Error", error);
                    }}
                  />
                </div>
              ) : (
                <button onClick={toggleModal} className={cx("proceed-btn")}>
                  ORDER
                </button>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}

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
                    <div className={cx("buy-btn")} onClick={payByCash}>
                      BUY
                    </div>
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
