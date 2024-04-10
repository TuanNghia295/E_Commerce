import classNames from "classnames/bind";
import styles from "./productDisplay.module.scss";
import star_icon from "../assets/Ecommerce_Frontend_Assets/Assets/star_icon.png";
import star_dull_icon from "../assets/Ecommerce_Frontend_Assets/Assets/star_dull_icon.png";
import { useContext } from "react";
import { ShopContext } from "../../context/ShopContext";

const cx = classNames.bind(styles);
const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  return (
    <div className={cx("productDisplay")}>
      <div className={cx("productDisplay-left"   )}>
        <div className={cx("productDisplay-img-list")}>
          <img src={product.image.replace(";","")} alt="" />
          <img src={product.image.replace(";","")} alt="" />
          <img src={product.image.replace(";","")} alt="" />
          <img src={product.image.replace(";","")} alt="" />
        </div>
        <div className={cx("productDisplay-img")}>
          <img
            src={product.image.replace(";","")}
            className={cx("productDisplay-main-img")}
            alt=""
          />
        </div>
      </div>
      <div className={cx("productDisplay-right")}>
        <h1>{product.name}</h1>
        <div className={cx("productDisplay-right-stars")}>
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>
        <div className={cx("productDisplay-right-prices")}>
          <div className={cx("productDisplay-right-price-old")}>
            ${product.old_price}
          </div>
          <div className={cx("productDisplay-right-price-new")}>
            ${product.new_price}
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
          {/* <p className={cx("productDisplay-category")}>
            <span>Category :</span> Women, T-shirt, Crop top
          </p>
          <p className={cx("productDisplay-category")}>
            <span>Tags :</span> Modern, Latest
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
