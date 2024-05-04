import classNames from "classnames/bind";
import styles from "./Modal.module.scss";
import { useEffect, useState, useCallback } from "react";
import { useDebounce } from "use-debounce";
const cx = classNames.bind(styles);
function Modal({ type, title, modalOpen, onClose }) {
  const [typeCheck, setTypeCheck] = useState(type);
  const [email, setEmail] = useState("");
  const [debouncedEmail] = useDebounce(email, 500);

  const handleChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handleOverlayClick = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    setTypeCheck(type);
  }, [type]);

  useEffect(() => {
    console.log(debouncedEmail);
  }, [debouncedEmail]);

  return (
    <>
      {modalOpen && typeCheck === "email" && (
        <div className={cx("Overlay")} onClick={handleOverlayClick}>
          {/* Overlay */}
          <div className={cx("Container")} onClick={(e) => e.stopPropagation()}>
            {/* Stop propagation to prevent the modal from closing when clicking inside */}
            <>
              <div className={cx("Modal-header")}>
                <h1>{title}</h1>
              </div>
              <div className={cx("Modal-content")}>
                <div>
                  <label htmlFor="email">New Email: </label>
                </div>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
                <div className={cx("Modal-options")}>
                  <button className={cx("update-btn")}>Update</button>
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
