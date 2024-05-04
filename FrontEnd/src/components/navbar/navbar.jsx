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
import { CiUser } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
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
    setUser(false);
    document.location.href = "/";
  };

  const handleProfile = () => {
    setDropdown(false)
    navigate("/profile");
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    if (dropdown) {
      document.addEventListener("mousedown", handleClickOutSide);
    } else {
      document.removeEventListener("mousedown", handleClickOutSide);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [dropdown]);

  return (
    <div className={cx("navbar")}>
      <div className={cx("nav-logo")}>
        <Link to={"/"} onClick={()=>setMenu("home")}>
          <img src={logo}alt="" srcSet="" height="100" width="100" />
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
            visible={dropdown}
            interactive={true}
            render={(attrs) => (
              <div {...attrs} ref={dropdownRef}>
                <ul className={cx("nav-dropdownList")}>
                  <li
                    className={cx("nav-dropdownItems")}
                    onClick={handleProfile}
                  >
                    <span className={cx("nav-dropItemsIcons")}>
                      <CgProfile />
                    </span>
                    <p>Profile</p>
                  </li>
                  <li
                    className={cx("nav-dropdownItems")}
                    onClick={handleLogout}
                  >
                    <span className={cx("nav-dropItemsIcons")}>
                      <IoIosLogOut />
                    </span>
                    <p>Logout</p>
                  </li>
                </ul>
              </div>
            )}
          >
            <button
              className={cx("square-btn")}
              onClick={() => setDropdown(!dropdown)}
            >
              <div className={cx("user-icon")}>
                <CiUser />
              </div>
              <p> {localStorage.getItem("displayName")}</p>
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
