import classNames from 'classnames/bind'
import styles from "./footer.module.scss";
import instagram_icon from "../assets/Ecommerce_Frontend_Assets/Assets/instagram_icon.png"
import pintester_icon from "../assets/Ecommerce_Frontend_Assets/Assets/pintester_icon.png"
import whatsapp_icon from "../assets/Ecommerce_Frontend_Assets/Assets/whatsapp_icon.png"
import logo from "../assets/Ecommerce_Frontend_Assets/Assets/nike.png";

const cx = classNames.bind(styles)
const Footer = () => {
  return (
    <div className={cx("footer")}>
        <div className={cx("footer-logo")}>
            <img src={logo} alt="" width={100} />
            <p>NIKE</p>
        </div>
        <ul className={cx("footer-links")}>
            <li>Company</li>
            <li>Products</li>
            <li>Offices</li>
            <li>About</li>
            <li>Contact</li>
        </ul>
        <div className={cx("footer-social-icons")}>
            <div className={cx("footer-icons-container")}>
                <img src={instagram_icon} alt="" />
            </div>
            <div className={cx("footer-icons-container")}>
                <img src={pintester_icon} alt="" />
            </div>
            <div className={cx("footer-icons-container")}>
                <img src={whatsapp_icon} alt="" />
            </div>
        </div>
        <div className={cx("footer-copyright")}>
            <hr />
            <p>Copyright @ 2024 - All Right Reserved.</p>
        </div>

    </div>
  )
}

export default Footer