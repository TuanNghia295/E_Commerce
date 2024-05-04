import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import { useEffect, useState } from "react";
import auth from "../../config/firebase";
import RightSection from "./RightSection";
const cx = classNames.bind(styles);

function Profile() {
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState("Personal Information");

  useEffect(() => {
    const userData = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        const response = await fetch("http://localhost:2905/userInfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userInfo = await response.json();
        setUser(userInfo);
      }
    };
    userData();
  }, []);

  const handleLogout = () => {
    setMenu("logOut");
    auth.signOut();
    localStorage.removeItem("authToken");
    localStorage.removeItem("displayName");
    document.location.href = "/";
  };

  const handleChangeEmail = () => {};

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
                  value={
                    <div className={cx("addressInfo-container")}>
                      <div className={cx("addressInfo-section")}>
                        <div>FullName:</div>
                        <span className={cx("fullName-val")}> Null</span>
                      </div>

                      <div className={cx("addressInfo-section")}>
                        <div>Address:</div>
                        <span className={cx("fullName-val")}> Null</span>
                      </div>

                      <div className={cx("addressInfo-section")}>
                        <div>Phone Numbers:</div>
                        <span className={cx("fullName-val")}> Null</span>
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
                <RightSection detail="EMAIL" type={"email"} value={user.email} />
                <RightSection detail="PASSWORD" value="********" />
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
