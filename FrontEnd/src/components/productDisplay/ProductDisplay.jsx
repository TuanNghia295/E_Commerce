import classNames from "classnames/bind";
import styles from "./productDisplay.module.scss";
import star_icon from "../assets/Ecommerce_Frontend_Assets/Assets/star_icon.png";
import star_dull_icon from "../assets/Ecommerce_Frontend_Assets/Assets/star_dull_icon.png";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";

const cx = classNames.bind(styles);

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const productImage = product.image.replace(";", "");
  const [toogleLogin, setToogleLogin] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // hàm kiểm soát sizez sản phẩm
  const handleSizeClick = (e) => {
    setSelectedSize(e);
  };

  // hàm kiểm soát trạng thái thêm sản phẩm
  const handleAddToCart = (pro_code) => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart");
      return;
    }
    if (localStorage.getItem("authToken")) {
      addToCart(pro_code, selectedSize);
      setIsAddedToCart(true);
      const id = setTimeout(() => {
        setIsAddedToCart(false);
      }, 1000);
      setTimeoutId(id);
    } else {
      console.log("click");
      setToogleLogin(!toogleLogin);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  // Hiện ra ngôi sao
  const renderStars = () => {
    let stars = [];
    for (let i = 0; i < 4; i++) {
      stars.push(<img key={i} src={star_icon} alt="" />);
    }
    stars.push(<img key={5} src={star_dull_icon} alt="" />);
    return stars;
  };

  return (
    <div className={cx("productDisplay")}>
      <div className={cx("productDisplay-left")}>
        <div className={cx("productDisplay-img-list")}>
          {[...Array(4)].map((_, i) => (
            <img key={i} src={productImage} alt="" />
          ))}
        </div>
        <div className={cx("productDisplay-img")}>
          <img
            src={productImage}
            className={cx("productDisplay-main-img")}
            alt=""
          />
        </div>
      </div>
      <div className={cx("productDisplay-right")}>
        <h1>{product.name}</h1>
        <div className={cx("productDisplay-right-stars")}>
          {renderStars()}
          <p>(122)</p>
        </div>
        <div className={cx("productDisplay-right-prices")}>
          <div className={cx("productDisplay-right-price-old")}>
            ${product.old_price.toLocaleString()}
          </div>
          <div className={cx("productDisplay-right-price-new")}>
            ${product.new_price.toLocaleString()}
          </div>
        </div>
        <div className={cx("productDisplay-description")}>
          Indulge in the timeless charm of our Elegant Floral Maxi Dress – a
          fusion of sophistication and comfort. This graceful dress is designed
          to elevate your style, making it perfect for both casual outings and
          special occasions.
        </div>
        <div className={cx("productDisplay-right-size")}>
          <h1>Select Size</h1>
          <div className={cx("productDisplay-right-sizes")}>
            {product.size.map((size, index) => {
              // Kiểm tra nếu size chứa dấu phẩy
              if (size.includes(",")) {
                // Tách size thành một mảng các chuỗi con và bỏ dấu phẩy
                size = size.split(",").join("");
              }
              return (
                <div
                  key={index}
                  className={cx({ selected: size === selectedSize })}
                  onClick={() => handleSizeClick(size)}
                >
                  {size}
                </div>
              );
            })}
          </div>
          <button onClick={() => handleAddToCart(product.pro_code)}>
            ADD TO CART
          </button>
          {toogleLogin && (
            <>
              <div
                className={cx("cartItems-modal-overlay")}
                onClick={() => setToogleLogin(false)}
              ></div>
              <div className={cx("cartItems-modal")}>
                <h2>You Have To Login</h2>
                <div className={cx("cartItems-modal-box")}>
                  <div className={cx("cartItems-modal-button")}>
                    <div
                      className={cx("login-btn")}
                      onClick={() => (document.location.href = "/login")}
                    >
                      Login
                    </div>
                  </div>
                  <div className={cx("cartItems-modal-button")}>
                    <div
                      className={cx("cancel-btn")}
                      onClick={() => setToogleLogin(false)}
                    >
                      CANCEL
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {isAddedToCart && (
            <div className={cx("productDisplay-notification")}>
              Product added to cart!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
