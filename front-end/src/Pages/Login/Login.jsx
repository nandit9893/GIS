import React, { useContext, useState } from "react";
import "./Login.css";
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpeg";
import { toast } from "react-toastify";
import axios from "axios";
const Login = () => {
  const { url, setUserID } = useContext(AppContext);
  const [authMode, setAuthMode] = useState("Sign Up");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [termAccepted, setTermAccepted] = useState(false);
  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onTermsChange = () => {
    setTermAccepted((prev) => !prev);
  };

  const handleRegistration = async (newURL) => {
    if (!data.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!data.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!data.password.trim()) {
      toast.error("Password is required");
      return;
    }
    try {
      const response = await axios.post(newURL, data);
      if (response.data.data) {
        toast.success("Account created successfully! Please Login");
        setAuthMode("Login");
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleLogin = async (newURL) => {
    if (!data.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!data.password.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      const response = await axios.post(newURL, data);
      if (response.data.success) {
        const { accessToken, user } = response.data.data;
        setUserID(user.userID); 
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          toast.success("Login Successful");
          navigate(`/home/${user.userID}`);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    let newURL = `${url}/gis/user/${authMode === "Sign Up" ? "register" : "login"}`;
    if (authMode === "Sign Up") {
      await handleRegistration(newURL);
    } else {
      await handleLogin(newURL);
    }
  };

  return (
    <div className="login">
      <img src={logo} alt="" className="logo" />
      <form className={authMode === "Sign Up" ? "login-form" : "login-form-log"} onSubmit={onSubmitHandler}>
        <h2>{authMode}</h2>
        {
          authMode === "Sign Up" && 
          (
            <input name="name" onChange={onChangeHandler} value={data.name} type="text" className="form-input" placeholder="Enter your name" required/>
          )
        }
        <input name="email" onChange={onChangeHandler} value={data.email} type="email" className="form-input" placeholder="Email" required />
        <input name="password" onChange={onChangeHandler} value={data.password} type="password" className="form-input" placeholder="Password" required />
        <button type="submit" disabled={authMode === "Sign Up" && !termAccepted}>
          {
            authMode === "Sign Up" ? "Create Account" : "Log In"
          }
        </button>
        {
          authMode === "Sign Up" && 
            (
              <div className="login-term">
                <input type="checkbox" checked={termAccepted} onChange={onTermsChange}/>
                <p>Agree to the terms of use & privacy policy.</p>
              </div>
            )
        }
        <div className="login-forgot">
          {
            authMode === "Sign Up" ? 
            (
              <p className="login-toggle">{" "}Already have an account?{" "}<span onClick={() => setAuthMode("Login")}>Login here</span></p>
            ) : 
            (
              <p className="login-toggle">{" "}Create an account?{" "}<span onClick={() => setAuthMode("Sign Up")}>Sign Up</span></p>
            )
          }
        </div>
      </form>
    </div>
  );
};

export default Login;
