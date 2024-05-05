import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import Modal from "../modal/modal";
import { useState } from "react";

const cx = classNames.bind(styles);
function RightSection({ detail, type, value }) {
  const [openModal, setOpenModal] = useState(false);
  const handelOpenModal = () => {
    if (type) {
      setOpenModal(!openModal);
    }
    return false;
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <>
      <div className={cx("right-section-details")}>
        <h3>{detail}</h3>
        <div className={cx("right-section-email")}>
          <div>{value}</div>
        </div>
        <div className={cx("right-section-edit")}>
          <button className={cx("edit-btn")} onClick={handelOpenModal}>
            EDIT
          </button>
        </div>
      </div>
      {type === "email" && (
        <Modal
          title={"Update Email"}
          type={"email"}
          modalOpen={openModal}
          onClose={handleCloseModal}
        />
      )}
      {type === "password" && (
        <Modal
          title={"Update PassWord"}
          type={"password"}
          modalOpen={openModal}
          onClose={handleCloseModal}
        />
      )}
      {type === "address" && (
        <Modal
          title={"Update Address Infor"}
          type={"address"}
          modalOpen={openModal}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

export default RightSection;
