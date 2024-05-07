import "./navbar.css";
import nikelogo from "../../assets/nike.png";
import { CiLogout } from "react-icons/ci";
const Navbar = () => {
  const handleLogOut = () => {
    localStorage.removeItem("authToken");
    window.location.href = "http://localhost:5173/login";
  };
  return (
    <div className="navbar">
      <img src={nikelogo} alt="" className="nav-logo" width={50} />
      <CiLogout onClick={handleLogOut} className="nav-profile" />
    </div>
  );
};

export default Navbar;
