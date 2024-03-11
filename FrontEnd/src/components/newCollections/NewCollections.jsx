import classNames from 'classnames/bind'
import styles from "./newCollections.module.scss";
import new_collection from "../assets/Ecommerce_Frontend_Assets/Assets/new_collections"
import Item from '../items/Item';

const cx = classNames.bind(styles)
const NewCollections = () => {
  return (
    <div className={cx("new-collections")}>
        <h1>NEW COLLECTIONS</h1>
        <hr />
        <div className={cx("collections")}>
            {new_collection.map((item,index)=>{
              const {id,name,image,new_price,old_price} = item
                return <Item key={index} id={id} name={name} image={image} new_price={new_price} old_price={old_price}/>
            })}
        </div>
    </div>
  )
}

export default NewCollections