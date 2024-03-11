import  "./navbar.css"
import nikelogo from "../../assets/nike.png"
import { FaRegUserCircle } from "react-icons/fa";
const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={nikelogo} alt="" className="nav-logo" width={50} />
      <FaRegUserCircle className="nav-profile" />
    </div>
  )
}

export default Navbar