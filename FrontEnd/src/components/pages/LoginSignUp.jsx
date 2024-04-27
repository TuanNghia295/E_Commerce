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
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // Lấy thông tin của người dùng
        const userId = user.uid;
        const email = user.email;
        const displayName = user.displayName;
        const photoURL = user.photoURL;
        console.log("userInfo", user);

        // gửi thông tin người dùng đến server
        const userData = { userId, email, displayName, photoURL };
        fetch("http://localhost:2905/login", {
          method: "POST",
          headers: {
            Accept: "application/form-data",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userData }),
        })
          .then((response) => response.json())
          .then((data) => console.log(data));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error", { errorCode, errorMessage });
      });
  };

  // const signUp = async () => {
  //   console.log("signUp", formData);
  //   let responseData;
  //   const token = localStorage.getItem("Authorization");
  //   await fetch("http://localhost:2905/signUp", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/form-data",
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + token,
  //     },
  //     // sẽ chuyển giá trị object của formData thành dạng JSON chuỗi
  //     body: JSON.stringify(formData),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => (responseData = data));
  //   if (responseData.success) {
  //     localStorage.setItem("Authorization", responseData.token);
  //     alert("Create account successfully");
  //     window.location.replace("/");
  //   } else {
  //     alert(responseData.error);
  //   }
  // };

  const signUp = async () => {
    // Get data in formData
    const userData = formData;
    console.log("userData", userData);
    await fetch("http://localhost:2905/signUp", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userData }),
      credentials: "include", // Include credentials
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          alert(data.message);
          document.location.href ="/"
        }
      });
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
