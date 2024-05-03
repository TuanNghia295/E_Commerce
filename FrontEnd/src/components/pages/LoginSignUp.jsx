import classNames from "classnames/bind";
import styles from "./scss/loginSignUp.module.scss";
import { useState } from "react";
import auth from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
const cx = classNames.bind(styles);
const LoginSignUp = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    displayName: "",
    password: "",
    email: "",
  });

  const changeHandler = (e) => {
    // sử dụng spread để tạo ra bản sao của formData. từ đó thay đổi giá trị trong bản sao đó
    //  rồi mới cập nhật lại state
    // Tạo bản sao của state hiện tại bằng spread operator
    const formDataCopy = { ...formData };
    formDataCopy[e.target.name] = e.target.value;
    setFormData(formDataCopy);
  };

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      // Signed in
      const user = userCredential.user;
      // Lấy thông tin của người dùng
      const userId = user.uid;
      const email = user.email;
      const displayName = user.displayName;
      const photoURL = user.photoURL;

      //  lấy token
      const token = localStorage.getItem("authToken");

      // gửi thông tin người dùng đến server
      const userData = { userId, email, displayName, photoURL };
      const response = await fetch("http://localhost:2905/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("data");
      if (data.success) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("displayName", data.dbData.displayName);
        alert(data.message);
        if (email === "admin@gmail.com" && formData.password === "qweasd") {
          document.location.href = "http://localhost:5174";
        } else {
          document.location.href = "/";
        }
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Password or email invalid");
      console.log("error", { errorCode, errorMessage });
    }
  };

  const signUp = async () => {
    // Get data in formData
    const userData = formData;
    console.log("userData", userData);

    try {
      const response = await fetch("http://localhost:2905/signUp", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData }),
        credentials: "include", // Include credentials
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        document.location.href = "/";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("An error occurred while signing up:", error);
      alert("An error occurred while signing up. Please try again.");
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:2905/auth/google";
  };
  return (
    <div className={cx("loginSingup")}>
      <div className={cx("loginSignup-container")}>
        <h1>{state}</h1>
        <div className={cx("loginSingup-fields")}>
          {state === "Sign Up" ? (
            <input
              type="text"
              onChange={changeHandler}
              placeholder="username"
              name="displayName"
              value={formData.displayName}
            />
          ) : (
            <></>
          )}
          <input
            type="email"
            onChange={changeHandler}
            placeholder="Email address"
            name="email"
            value={formData.email}
          />
          <input
            type="password"
            onChange={changeHandler}
            placeholder="Password"
            name="password"
            value={formData.password}
          />
        </div>
        <div className={cx("loginSingup-fields")}>
          <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
        <button
          onClick={() => {
            state === "Login" ? login() : signUp();
          }}
        >
          Continue
        </button>
        {state === "Sign Up" ? (
          <p className={cx("loginSingup-login")}>
            Already have an account ?{" "}
            <span onClick={() => setState("Login")}>Login here</span>
          </p>
        ) : (
          <p className={cx("loginSingup-login")}>
            Create an account ?{" "}
            <span onClick={() => setState("Sign Up")}>Click here</span>
          </p>
        )}

        <div className={cx("loginSignup-agree")}>
          <input type="checkbox" name="" id="" />
          <p>By continuting, i agree to the terms of use & privacy policy</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
