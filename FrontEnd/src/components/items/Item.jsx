import classNames from "classnames/bind";
import styles from "./Item.module.scss";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);
const Item = ({ id, image, name, new_price, old_price }) => {
  return (
    <div className={cx("item")} id={id}>
      <Link to={`/product/${id}`}>
        <img
          onClick={window.scrollTo(0, 0)}
          src={image.replace(";", "")}
          
          alt=""
        />
      </Link>
      <p>{name}</p>
      <div className={cx("item-prices")}>
        <div className={cx("item-price-new")}>${new_price.toLocaleString()}</div>
        <div className={cx("item-price-old")}>${old_price.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default Item;
