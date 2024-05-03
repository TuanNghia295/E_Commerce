import classNames from 'classnames/bind'
import styles from "./hero.module.scss";
import hand_icon from "../assets/Ecommerce_Frontend_Assets/Assets/hand_icon.png"
import arrow_icon from "../assets/Ecommerce_Frontend_Assets/Assets/arrow.png"
import nikeShoes from "../assets/Ecommerce_Frontend_Assets/Assets/nikeShoes.png"
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles)
const Hero = () => {
  return (
    <div className={cx("hero")}>
        <div className={cx("hero-left")}>
            <div>
                <div className={cx("hero-hand-icon")}>
                    <p>JUST DO IT</p>
                </div>
               <Link to={"/men"}>
                    <div className={cx("hero-latest-btn")}>
                        <div>Latest Collection</div>
                        <img src={arrow_icon} alt="" />
                    </div>
               </Link>
            </div>
        </div>
        <div className={cx("hero-right")}>
            <Link to={"/product/J1"}><img src={nikeShoes} alt="" /></Link>
        </div>
    </div>
  )
}

export default Hero