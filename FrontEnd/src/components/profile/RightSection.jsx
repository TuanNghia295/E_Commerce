import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import Modal from "../modal/modal";
import { useState } from "react";

function RightSection({ detail, type, value, onEdit }) {
  const cx = classNames.bind(styles);
  const [isModalOpen, setIsModalOpen] = useState(false); // New state to control the visibility of the modal

  const handleEdit = () => {
    setIsModalOpen(true);
    if (onEdit) {
      onEdit();
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={cx("right-section-details")}>
        <h3>{detail}</h3>
        <div className={cx("right-section-email")}>
          <div>{value}</div>
        </div>
        <div className={cx("right-section-edit")}>
          <button className={cx("edit-btn")} onClick={handleEdit}>
            EDIT
          </button>
        </div>
      </div>
      <Modal type={type} title={"Email"} modalOpen={isModalOpen} onClose={handleClose} />
    </>
  );
}

export default RightSection;