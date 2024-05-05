import classNames from "classnames/bind";
import styles from "./Modal.module.scss";
import { useEffect, useState, useCallback } from "react";
import { useDebounce } from "use-debounce";
import auth from "../../config/firebase";
import {
  EmailAuthProvider,
  signInWithCredential,
  updatePassword,
} from "firebase/auth";

const cx = classNames.bind(styles);
function Modal({ type, title, modalOpen, onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    currentPass: "",
    newPass: "",
    confirmNewPass: "",
    fullName: "",
    address: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [debouncedEmail] = useDebounce(formData.email, 500);

  const handleOverlayClick = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const [typeCheck, setTypeCheck] = useState(type);

  useEffect(() => {
    setTypeCheck(type);
  }, [type]);

  const handleUpdateEmail = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const repsonse = await fetch("http://localhost:2905/update/email", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: debouncedEmail }),
        });
        if (!repsonse.ok) {
          throw new Error(
            "Network response when trying update email not working"
          );
        }
        const data = await repsonse.json();
        if (data.success) {
          alert("Updated email");
          window.location.reload();
        }
      }
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  };

  const handleUpdatePassword = async () => {
    // Get the currently logged in user
    const user = auth.currentUser;

    // Check if the password fields are not empty
    if (
      !formData.currentPass ||
      !formData.newPass ||
      !formData.confirmNewPass
    ) {
      alert("Password fields can not be empty");
      return;
    }

    // Re-authenticate the user
    const credentials = EmailAuthProvider.credential(
      user.email,
      formData.currentPass
    );
    try {
      await signInWithCredential(auth, credentials);
    } catch (error) {
      alert("Current password is incorrect");
      return;
    }

    // Check if the new password and confirm password are the same
    if (formData.newPass !== formData.confirmNewPass) {
      alert("New password and confirm password must be the same");
      setFormData((prev) => {
        return { ...prev, newPass: "", currentPass: "", confirmNewPass: "" };
      });
      return;
    }

    // Update the password
    try {
      await updatePassword(user, formData.newPass);
      alert("Password updated");
      window.location.reload();
    } catch (error) {
      console.error("Error updating password", error);
    }
  };

  const handelUpdateAdress = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const response = await fetch("http://localhost:2905/update/address", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            address: formData.address,
            phoneNumber: formData.phoneNumber,
          }),
        });
        if (!response.ok) {
          throw new Error(
            "Network response when trying update address not working"
          );
        }
        const data = await response.json();
        if (data.success) {
          alert("Updated address");
          window.location.reload();
        }
      }
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  };

  return (
    <>
      {modalOpen && typeCheck === "email" && (
        <div className={cx("Overlay")} onClick={handleOverlayClick}>
          <div className={cx("Container")} onClick={(e) => e.stopPropagation()}>
            <>
              <div className={cx("Modal-header")}>
                <h1>{title}</h1>
              </div>
              <div className={cx("Modal-content")}>
                <div className={cx("Modal-content-section")}>
                  <label htmlFor="email">New Email: </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("Modal-options")}>
                  <button
                    className={cx("update-btn")}
                    onClick={handleUpdateEmail}
                  >
                    Update
                  </button>
                  <button
                    className={cx("cancel-btn")}
                    onClick={handleOverlayClick}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          </div>
        </div>
      )}
      {modalOpen && typeCheck === "password" && (
        <div className={cx("Overlay")} onClick={handleOverlayClick}>
          <div className={cx("Container")} onClick={(e) => e.stopPropagation()}>
            <>
              <div className={cx("Modal-header")}>
                <h1>{title}</h1>
              </div>
              <div className={cx("Modal-content")}>
                <div className={cx("Modal-content-section")}>
                  <label htmlFor="currentPass">Current Password: </label>
                  <input
                    type="password"
                    id="currentPass"
                    name="currentPass"
                    value={formData.currentPass}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("Modal-content-section")}>
                  <label htmlFor="newPass">New Password: </label>
                  <input
                    type="password"
                    id="newPass"
                    name="newPass"
                    value={formData.newPass}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("Modal-content-section")}>
                  <label htmlFor="confirmNewPass">Confirm New Password: </label>
                  <input
                    type="password"
                    id="confirmNewPass"
                    name="confirmNewPass"
                    value={formData.confirmNewPass}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("Modal-options")}>
                  <button
                    className={cx("update-btn")}
                    onClick={handleUpdatePassword}
                  >
                    Update
                  </button>
                  <button
                    className={cx("cancel-btn")}
                    onClick={handleOverlayClick}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          </div>
        </div>
      )}

      {modalOpen && typeCheck === "address" && (
        <div className={cx("Overlay")} onClick={handleOverlayClick}>
          <div className={cx("Container")} onClick={(e) => e.stopPropagation()}>
            <>
              <div className={cx("Modal-header")}>
                <h1>{title}</h1>
              </div>
              <div className={cx("Modal-content")}>
                <div className={cx("Modal-content-section")}>
                  <label htmlFor="fullName">FullName: </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("Modal-content-section")}>
                  <label htmlFor="address">Address: </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("Modal-content-section")}>
                  <label htmlFor="phoneNumber">Phone Number: </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("Modal-options")}>
                  <button
                    className={cx("update-btn")}
                    onClick={handelUpdateAdress}
                  >
                    Update
                  </button>
                  <button
                    className={cx("cancel-btn")}
                    onClick={handleOverlayClick}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
