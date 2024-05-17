import "./App.css";
import { Navbar } from "./components/navbar/navbar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/pages/Home";
import ShopCategory from "./components/pages/ShopCategory";
import Products from "./components/pages/Products";
import Cart from "./components/pages/Cart";
import LoginSignUp from "./components/pages/LoginSignUp";
import Footer from "./components/footer/Footer";
import men_banner from "./components/assets/Ecommerce_Frontend_Assets/Assets/banner_mens.png";
import women_banner from "./components/assets/Ecommerce_Frontend_Assets/Assets/banner_women.png";
import kid_banner from "./components/assets/Ecommerce_Frontend_Assets/Assets/banner_kids.png";
import { useContext, useEffect } from "react";
import { ShopContext } from "./context/ShopContext";
import Profile from "./components/profile/Profile.jsx";
import Cookies from 
function App() {
  const { tokenExpired, user } = useContext(ShopContext);
  useEffect(() => {
    if (tokenExpired) {
      localStorage.removeItem("authToken");
    }
  }, [tokenExpired]);

  useEffect(() => {
    const getUserInfo = async () => {
      const authToken = Cookies.get('authToken');
      const response = await fetch("http://localhost:2905/userInfo", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      console.log("data", data);
    };
    getUserInfo();
  }, [user]);

  return (
    <div>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/:userId" element={<Home />}></Route>
          <Route
            path="/men"
            element={<ShopCategory banner={men_banner} categories="men" />}
          ></Route>
          <Route
            path="/women"
            element={<ShopCategory banner={women_banner} categories="women" />}
          ></Route>
          <Route
            path="/kid"
            element={<ShopCategory banner={kid_banner} categories="kid" />}
          ></Route>
          <Route path="/product" element={<Products />}>
            <Route path=":productId" element={<Products />}></Route>
          </Route>
          <Route
            path="/cart"
            element={tokenExpired ? <Navigate to={"/login"} /> : <Cart />}
          ></Route>
          <Route path="/login" element={<LoginSignUp />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
