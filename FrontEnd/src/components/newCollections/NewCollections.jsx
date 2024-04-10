import classNames from "classnames/bind";
import styles from "./newCollections.module.scss";
import Item from "../items/Item";
import { useState, useEffect } from "react";

const cx = classNames.bind(styles);
const NewCollections = () => {
  const [new_collection, setNew_collection] = useState([]);

  useEffect(() => {
    async function fecthNewCollections() {
      await fetch("http://localhost:2905/newcollections")
        .then((response) => response.json())
        .then((data) => setNew_collection(data));
    }
    fecthNewCollections();
  }, []);

  return (
    <div className={cx("new-collections")}>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className={cx("collections")}>
        {new_collection.map((item, index) => {
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

export default NewCollections;
