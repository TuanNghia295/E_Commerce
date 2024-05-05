import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import { useContext, useState } from "react";
import auth from "../../config/firebase";
import RightSection from "./RightSection";
import { ShopContext } from "../../context/ShopContext";
const cx = classNames.bind(styles);

function Profile() {
  const [menu, setMenu] = useState("Personal Information");
  const { user } = useContext(ShopContext);

  const handleLogout = () => {
    setMenu("logOut");
    auth.signOut();
    localStorage.removeItem("authToken");
    localStorage.removeItem("displayName");
    document.location.href = "/";
  };

  return (
    <div className={cx("container")}>
      {user ? (
        <>
          <div className={cx("pro-header")}>
            <div className={cx("pro-avatar")}>
              <img src="" alt="" />
            </div>
            <div className={cx("pro-info")}>
              <div className={cx("pro-name")}>
                <h1>
                  <span>Hi </span>
                  {user.displayName
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </h1>
              </div>
            </div>
          </div>
          <div className={cx("pro-content")}>
            <div className={cx("left-section")}>
              <div className={cx("lef-section-header")}>
                <h3>Account Overview</h3>
              </div>
              <ul className={cx("account-list")}>
                <li
                  className={cx("account-list-items", {
                    active: menu === "Personal Information",
                  })}
                  onClick={() => setMenu("Personal Information")}
                >
                  <p>Personal Information</p>
                </li>

                <li
                  className={cx("account-list-items", {
                    active: menu === "Address",
                  })}
                  onClick={() => setMenu("Address")}
                >
                  <p>Address</p>
                </li>

                <li
                  onClick={handleLogout}
                  className={cx("account-list-items", {
                    active: menu === "logOut",
                  })}
                >
                  <p>Log out</p>
                </li>
              </ul>
            </div>

            {menu === "Address" ? (
              <div className={cx("right-section")}>
                <div className={cx("right-section-header")}>
                  <h1>ADDRESS DETAILS</h1>
                </div>
                <RightSection
                  type={"address"}
                  value={
                    <div className={cx("addressInfo-container")}>
                      <div className={cx("addressInfo-section")}>
                        <strong>FullName: </strong>
                        <span className={cx("fullName-val")}>
                          {user.fullName}
                        </span>
                      </div>

                      <div className={cx("addressInfo-section")}>
                        <strong>Address:</strong>
                        <span className={cx("fullName-val")}>
                          {user.address}
                        </span>
                      </div>

                      <div className={cx("addressInfo-section")}>
                        <strong>Phone Number:</strong>
                        <span className={cx("fullName-val")}>
                          {" "}
                          {user.phoneNumber}
                        </span>
                      </div>
                    </div>
                  }
                />
              </div>
            ) : (
              <div className={cx("right-section")}>
                <div className={cx("right-section-header")}>
                  <h1>LOGIN DETAILS</h1>
                </div>
                <RightSection
                  detail="EMAIL"
                  type={"email"}
                  value={user.email}
                />
                <RightSection
                  detail="PASSWORD"
                  type={"password"}
                  value="********"
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default Profile;
