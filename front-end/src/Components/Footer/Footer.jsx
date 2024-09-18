import React, { useState, useContext } from "react";
import "./Footer.css";
import { AppContext } from "../../Context/AppContext";
import { states } from "../../Utils/states&district.js";

const Footer = () => {
  const { setState, setDistrict } = useContext(AppContext);
  const [selectedState, setSelectedState] = useState("None");
  const [districtOptions, setDistrictOptions] = useState([]);

  const handleStateChange = (e) => {
    const stateValue = e.target.value;
    setSelectedState(stateValue);
    setState(stateValue);
    const selectedStateObj = states.find(stateObj => stateObj.state === stateValue);
    if (selectedStateObj) {
      setDistrictOptions(selectedStateObj.districts);
    } else {
      setDistrictOptions([]);
    }
    setDistrict("None");
  };

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
  };

  return (
    <div className="footer">
      <div className="select">
        <div className="select-area">
          <h2>Select State</h2>
          <select name="state" id="state" onChange={handleStateChange}>
            <option value="None">None</option>
            {
                states.map(stateObj => (
                    <option key={stateObj.state} value={stateObj.state}>{stateObj.state}</option>
              ))
            }
          </select>
        </div>
        <div className="select-area">
          <h2>Select District</h2>
          <select name="district" id="district" onChange={handleDistrictChange} disabled={districtOptions.length === 0}>
            <option value="None">None</option>
            {
                districtOptions.map(district => (
                    <option key={district} value={district}>{district}</option>
                ))
            }
          </select>
        </div>
      </div>
    </div>
  );
};

export default Footer;
