import { useContext, useEffect } from "react";
import Item from "../items/Item";
import { ShopContext } from "../../context/ShopContext";
import dropdown_icon from "../assets/Ecommerce_Frontend_Assets/Assets/dropdown_icon.png";
import classNames from "classnames/bind";
import styles from "./scss/shopCategory.module.scss";
const cx = classNames.bind(styles);
const ShopCategory = ({ banner, categories }) => {
  const { all_product } = useContext(ShopContext);
  useEffect(()=>{
    console.log("all_product",all_product);
  },[])
  return (
    <div className={cx("shop-category")}>
      <img className={cx("shopcategory-banner")} src={banner} alt="" />

      <div className={cx("shopcategory-indexSort")}>
        <p>
          <span>Showing 1-12</span> out of 36 products
        </p>

        <div className={cx("shopcategory-sort")}>
          Sort by <img src={dropdown_icon} alt="" />
        </div>
      </div>

      <div className={cx("shopcategory-products")}>
        {all_product.map((item, index) => {
          const { pro_code, image, name, category, new_price, old_price } = item;
          if (categories === category) {
            return (
              <Item
                key={index}
                id={pro_code}
                name={name}
                image={image}
                new_price={new_price}
                old_price={old_price}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
      <div className={cx("shopcategory-loadmore")}>Explore more</div>
    </div>
  );
};

export default ShopCategory;
