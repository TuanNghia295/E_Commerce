import classNames from "classnames/bind";
import styles from "./descriptionBox.module.scss";

const cx = classNames.bind(styles);
const DescriptionBox = () => {
  return (
    <div className={cx("descriptionBox")}>
      <div className={cx("descriptionBox-navigator")}>
        <div className={cx("descriptionBox-nav-box")}>Description</div>
        <div className={cx("descriptionBox-nav-box", { fade: true })}>
          Review (122)
        </div>
      </div>
      <div className={cx("descriptionBox-description")}>
        <p>
          Artistry in Bloom: A delicate dance of blossoms adorns the fabric,
          infusing the dress with a botanical allure. The floral pattern,
          carefully chosen for its intricate detailing, brings a touch of
          nature's beauty to your ensemble.
        </p>
        <p>
          Maxi Length Magic: Immerse yourself in the allure of a full-length
          design that gracefully cascades to the floor. The maxi length is not
          just a style statement; it's a promise of elegance and sophistication,
          ensuring you stand out in any crowd.
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
