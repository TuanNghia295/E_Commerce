import classNames from 'classnames/bind'
import styles from "./hero.module.scss";
import hand_icon from "../assets/Ecommerce_Frontend_Assets/Assets/hand_icon.png"
import arrow_icon from "../assets/Ecommerce_Frontend_Assets/Assets/arrow.png"
import hero_image from "../assets/Ecommerce_Frontend_Assets/Assets/hero_image.png"

const cx = classNames.bind(styles)
const Hero = () => {
  return (
    <div className={cx("hero")}>
        <div className={cx("hero-left")}>
            <h2>NEW ARRIVALS ONLY</h2>
            <div>
                <div className={cx("hero-hand-icon")}>
                    <p>new</p>
                    <img src={hand_icon} alt="" />
                </div>
                <p>collections</p>
                <p>for everyone</p>
                <div className={cx("hero-latest-btn")}>
                    <div>Latest Collection</div>
                    <img src={arrow_icon} alt="" />
                </div>
            </div>
        </div>
        <div className={cx("hero-right")}>
            <img src={hero_image} alt="" />
        </div>
    </div>
  )
}

export default Hero