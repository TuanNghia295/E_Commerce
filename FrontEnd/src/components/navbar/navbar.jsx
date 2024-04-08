import { useContext, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./navbar.module.scss";
import logo from "../assets/Ecommerce_Frontend_Assets/Assets/nike.png";
import cart_icon from "../assets/Ecommerce_Frontend_Assets/Assets/cart_icon.png";
import { Link } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import { IoIosArrowDropdown } from "react-icons/io";
const cx = classNames.bind(styles);
export const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle(cx("nav-menu-visible"));
    e.target.classList.toggle(cx("open"));
  };

  return (
    <div className={cx("navbar")}>
      <div className={cx("nav-logo")}>
        <Link to={"/"}>
          <img src={logo} alt="" srcSet="" height="100" width="100" />
        </Link>
      </div>

      <div>
        <IoIosArrowDropdown
          onClick={dropdown_toggle}
          className={cx("nav-dropdown")}
        />
      </div>

      <ul ref={menuRef} className={cx("nav-menu")}>
        <li
          className={cx("menu-items")}
          onClick={() => {
            setMenu("home");
          }}
        >
          <Link to={"/"}>Home</Link>
          {menu === "home" ? <hr /> : ""}
        </li>
        <li
          className={cx("menu-items")}
          onClick={() => {
            setMenu("men");
          }}
        >
          <Link to={"/men"}>Men</Link>
          {menu === "men" ? <hr /> : ""}
        </li>
        <li
          className={cx("menu-items")}
          onClick={() => {
            setMenu("women");
          }}
        >
          <Link to={"/women"}>Women</Link>
          {menu === "women" ? <hr /> : ""}
        </li>
        <li
          className={cx("menu-items")}
          onClick={() => {
            setMenu("kid");
          }}
        >
          <Link to={"/kid"}>Kids</Link>
          {menu === "kid" ? <hr /> : ""}
        </li>
      </ul>

      <div className={cx("nav-login-cart")}>
        {localStorage.getItem("Authorization") ? (
          <button
            onClick={() => {
              localStorage.removeItem("Authorization");
              window.location.replace("/");
            }}
          >
            Logout
          </button>
        ) : (
          <Link to={"/login"}>
            <button>Login</button>
          </Link>
        )}

        <Link to={"/cart"}>
          <img src={cart_icon} alt="" />
        </Link>
        <div className={cx("nav-cart-count")}>{getTotalCartItems()}</div>
      </div>
    </div>
  );
};
