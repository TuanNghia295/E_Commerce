import classNames from 'classnames/bind'
import styles from "./newsLetters.module.scss";

const cx = classNames.bind(styles)
const NewsLetters = () => {
  return (
    <div className={cx("newsletter")}>
        <h1>Get Exclusive Offers On Your Email</h1>
        <p>Subcribe to our newletter and stay updated</p>
        <div>
            <input type="text" placeholder='Your email' />
            <button>Subscribe</button>
        </div>
    </div>
  )
}

export default NewsLetters