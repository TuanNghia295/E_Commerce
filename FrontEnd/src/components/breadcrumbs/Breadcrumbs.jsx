// Breadcrumbs có thể hiểu là một chuỗi liên kết từ lớn đến bé,
// giúp người dùng thấy được mình đang ở mục nào trên website
import classNames from "classnames/bind";
import styles from "./breadCrumbs.module.scss";
import arrow_icon from "../assets/Ecommerce_Frontend_Assets/Assets/arrow.png";

const cx = classNames.bind(styles);
const Breadcrumbs = ({product}) => {
  return (
    <div className={cx("breadCrumbs")}>
      HOME
      <img src={arrow_icon} alt="" />
      SHOP
      <img src={arrow_icon} alt="" />
      {product.category}
      <img src={arrow_icon} alt="" />
      {product.name}
    </div>
  );
};

export default Breadcrumbs;
