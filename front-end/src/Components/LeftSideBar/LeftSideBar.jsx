import React, { useContext } from "react";
import "./LeftSideBar.css";
import circle from "../../assets/circle.png";
import eraser from "../../assets/eraser.jpeg";
import hexagon from "../../assets/hexagon.png";
import line from "../../assets/line.png";
import pencil from "../../assets/pencil.png";
import square from "../../assets/square.jpeg";
import triangle from "../../assets/triangle.png";
import { AppContext } from "../../Context/AppContext";

const LeftSideBar = () => {
  const { setTool } = useContext(AppContext);

  const handleToolChange = (tool) => {
    setTool(tool);
  };

  return (
    <div className="left">
      <div className="left-panels">
        <h2>Elements</h2>
        <div className="left-logos">
          <ul>
            <li onClick={() => handleToolChange("pencil")}><img src={pencil} alt="Pencil" />Pencil</li>
            <li onClick={() => handleToolChange("eraser")}><img src={eraser} alt="Eraser" />Eraser</li>
            <li onClick={() => handleToolChange("line")}><img src={line} alt="Line" />Line</li>
            <li onClick={() => handleToolChange("triangle")}><img src={triangle} alt="Triangle" />Triangle</li>
            <li onClick={() => handleToolChange("square")}><img src={square} alt="Square" />Square</li>
            <li onClick={() => handleToolChange("hexagon")}><img src={hexagon} alt="Hexagon" />Hexagon</li>
            <li onClick={() => handleToolChange("circle")}><img src={circle} alt="Circle" />Circle</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
