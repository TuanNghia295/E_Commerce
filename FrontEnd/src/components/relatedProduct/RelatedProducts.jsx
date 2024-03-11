import classNames from "classnames/bind";
import styles from "./relatedProducts.module.scss";
import data_product from "../assets/Ecommerce_Frontend_Assets/Assets/data";
import Item from "../items/Item";
const cx = classNames.bind(styles);
const RelatedProducts = () => {
  return (
    <div className={cx("relatedProducts")}>
      <h1>Related Products</h1>
      <hr />
      <div className={cx("relatedProducts-item")}>
        {data_product.map((item, index) => {
          const { id, name, image, new_price, old_price } = item;
          return (
            <Item
              key={index}
              id={id}
              name={name}
              image={image}
              new_price={new_price}
              old_price={old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
