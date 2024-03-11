import "./sidebar.css";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to={"/addProduct"} className="link-items" style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <FaShoppingCart />
          <p>Add Product</p>
        </div>
      </Link>

      <Link to={"/listProduct"} className="link-items" style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <FaClipboardList />
          <p>Product List</p>
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;
