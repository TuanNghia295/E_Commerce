import classNames from "classnames/bind";
import styles from "./scss/loginSignUp.module.scss";
import { useEffect, useState } from "react";

const cx = classNames.bind(styles);
const LoginSignUp = () => {

  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
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
    let responseData;
    await fetch("http://localhost:2905/login", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((repsonse) => repsonse.json())
      .then((data) => (responseData = data));
    if (responseData.success) {
      localStorage.setItem("authToken", responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.error);
    }
  };

  const signUp = async () => {
    console.log("signUp", formData);
    let responseData;
    await fetch("http://localhost:2905/signUp", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      // sẽ chuyển giá trị object của formData thành dạng JSON chuỗi
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));
    if (responseData.success) {
      localStorage.setItem("authToken", responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.error);
    }
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
              name="username"
              value={formData.username}
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
