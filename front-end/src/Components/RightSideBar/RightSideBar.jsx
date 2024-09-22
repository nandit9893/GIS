import React, { useContext } from "react";
import "./RightSideBar.css";
import { AppContext } from "../../Context/AppContext";
import logo from "../../assets/logo.jpeg";
import left_icon from "../../assets/left.jpg";
import clean_icon from "../../assets/clean.jpeg";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

const RightSideBar = () => {
  const { isDarkMode, setIsDarkMode, url, undo, clean, state, savingUserDrawingData, fetchUserDrawingData, userDrawingData, getDrawingData } = useContext(AppContext); 
  const buttonText = isDarkMode ? "Enable Light Mode" : "Enable Dark Mode";

  const toggleDarkMode = (event) => {
    event.preventDefault();
    setIsDarkMode((prev) => !prev);
  };

  const navigate = useNavigate();

  const handleSave = async(event) => {
    event.preventDefault();
    await savingUserDrawingData();
    await fetchUserDrawingData();
  }

  const logout = async (event) => {
    event.preventDefault();
    const logOutUrl = `${url}/gis/user/logout`;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(logOutUrl, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("drawingData");
        localStorage.clear();
        navigate("/", { replace: true });
        toast.success("Logout successful");
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

  return (
    <div className="right">
      <div className="top-button">
        <button onClick={toggleDarkMode}><p>{buttonText}</p></button>
      </div>
      <div className={state === "None" ? "center-change-button" : "newclass"}>
        <button onClick={undo}><img src={left_icon} alt="" />Prev</button>
        <button onClick={clean}><img src={clean_icon} alt="" />Clear</button>
      </div>
      <div className={state !== "None" ? "save-button" : "newclass"}>
          <button onClick={handleSave} disabled={!userDrawingData || userDrawingData.length === 0} className={!userDrawingData || userDrawingData.length === 0 ? "disabled" : ""}>Save</button>
          <button onClick={handleSave} disabled={!getDrawingData || getDrawingData.length === 0} className={!getDrawingData || getDrawingData.length === 0 ? "disabled" : ""}>Delete All</button>
      </div>
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <div className="logout-button">
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default RightSideBar;
