import classNames from "classnames/bind";
import styles from "./relatedProducts.module.scss";
import data_product from "../assets/Ecommerce_Frontend_Assets/Assets/data";
import Item from "../items/Item";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import { useParams } from "react-router-dom";
const cx = classNames.bind(styles);
const RelatedProducts = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function getProduct() {
      const foundProduct = await all_product.find(
        (e) => e.pro_code === productId
      );
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }

    getProduct();
  }, [all_product, productId]);

  // Filter out the current product
  const relatedProducts = all_product.filter(
    (product) => product.pro_code !== product.ID
  );

  // Randomly select 4 products
  const selectedProducts = relatedProducts
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);
  return (
    <div className={cx("relatedProducts")}>
      <h1>Related Products</h1>
      <hr />
      <div className={cx("relatedProducts-item")}>
        {selectedProducts.slice(0, 4).map((item, index) => {
          const { pro_code, name, image, new_price, old_price } = item;
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
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
