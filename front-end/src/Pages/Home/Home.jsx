import React from "react";
import "./Home.css";
import LeftSideBar from "../../Components/LeftSideBar/LeftSideBar";
import CenterBox from "../../Components/CenterBox/CenterBox";
import RightSideBar from "../../Components/RightSideBar/RightSideBar";
const Home = () => {
  return (
    <div className="home">
      <LeftSideBar />
      <CenterBox />
      <RightSideBar />
    </div>
  );
};

export default Home;
