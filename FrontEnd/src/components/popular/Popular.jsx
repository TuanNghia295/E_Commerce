import data_product from "../assets/Ecommerce_Frontend_Assets/Assets/data";
import Item from "../items/Item";
import classNames from "classnames/bind";
import styles from "./Popular.module.scss";
import { useEffect, useState } from "react";

const cx = classNames.bind(styles);
const Popular = () => {
  const [popularWomen,setPopularWomen] = useState([])

  useEffect(()=>{
    fetch("http://localhost:2905/newcollections/popularinwoman")
    .then((response) => response.json()).then((data)=>setPopularWomen(data))
  },[])
  return (
    <div className={cx("popular")}>
      <h1>POPULAR IN WOMEN</h1>
      <hr />

      <div className={cx("popular-item")}>
        {popularWomen.map((item, index) => {
          const { pro_code, name, image, new_price, old_price } = item;
          return (
            <Item
              key={index}
              id={pro_code}
              name={name}
              image={image}
              new_price={new_price}
              old_price={old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Popular;
