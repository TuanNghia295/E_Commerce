import classNames from "classnames/bind";
import styles from "./productDisplay.module.scss";
import star_icon from "../assets/Ecommerce_Frontend_Assets/Assets/star_icon.png";
import star_dull_icon from "../assets/Ecommerce_Frontend_Assets/Assets/star_dull_icon.png";
import { useContext } from "react";
import { ShopContext } from "../../context/ShopContext";

const cx = classNames.bind(styles);

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const productImage = product.image.replace(";", "");

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
            <div>S</div>
            <div>M</div>
            <div>L</div>
            <div>XL</div>
            <div>XXL</div>
          </div>
          <button onClick={() => addToCart(product.pro_code)}>ADD TO CART</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;