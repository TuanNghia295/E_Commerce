import classNames from "classnames/bind";
import styles from "./offer.module.scss";
import nikebanner2 from "../assets/Ecommerce_Frontend_Assets/Assets/nikebanner2.jpg";
const cx = classNames.bind(styles);
const Offers = () => {
  return (
    <div className={cx("offers")}>
      <img src={nikebanner2} alt="" style={{ width: "120%" }} />
    </div>
  );
};

export default Offers;
