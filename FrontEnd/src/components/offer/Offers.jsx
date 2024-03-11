import classNames from 'classnames/bind'
import styles from "./offer.module.scss";
import exclusive_image from "../assets/Ecommerce_Frontend_Assets/Assets/exclusive_image.png"
const cx = classNames.bind(styles)
const Offers = () => {
  return (
    <div className={cx("offers")}>
      <div className={cx("offers-left")}>
        <h1>Exclusive</h1>
        <h1>Offers For You</h1>
        <p>ONLY ON BEST SELLERS PRODUCTS</p>
        <button>Check Now</button>
      </div>
      <div className={cx("offers-right")}>
        <img src={exclusive_image} alt="" />
      </div>
    </div>
  )
}

export default Offers