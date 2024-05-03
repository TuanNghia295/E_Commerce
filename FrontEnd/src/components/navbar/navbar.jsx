import { useContext, useEffect, useRef, useState, useCallback } from "react";
import classNames from "classnames/bind";
import styles from "./navbar.module.scss";
import logo from "../assets/Ecommerce_Frontend_Assets/Assets/nike.png";
import cart_icon from "../assets/Ecommerce_Frontend_Assets/Assets/cart_icon.png";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import { IoIosArrowDropdown } from "react-icons/io";
import auth from "../../config/firebase";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css"; // include tippy's CSS

const cx = classNames.bind(styles);
export const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState(false);

  const dropdown_toggle = useCallback((e) => {
    menuRef.current.classList.toggle(cx("nav-menu-visible"));
    e.target.classList.toggle(cx("open"));
  }, []);

  // check user log in or not
  const [user, setUser] = useState(false);
  useEffect(() => {
    const userCheck = () => {
      const token = localStorage.getItem("authToken");
      setUser(!!token);
    };
    userCheck();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem("authToken");
    localStorage.removeItem("displayName");
    setUser(false);
    document.location.href = "/";
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
        {user ? (
          <Tippy
            interactive={true}
            visible={dropdown}
            render={(attrs) => (
              <div {...attrs}>
                <ul>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
            )}
          >
            <button onClick={() => setDropdown(!dropdown)}>
              {localStorage.getItem("displayName")}
            </button>
          </Tippy>
        ) : (
          <div className={cx("nav-login-cart")}>
            <button onClick={() => navigate("/login")}>Login</button>
          </div>
        )}

        <Link to={"/cart"}>
          <img src={cart_icon} alt="" />
        </Link>
        <div className={cx("nav-cart-count")}>{getTotalCartItems()}</div>
      </div>
    </div>
  );
};
