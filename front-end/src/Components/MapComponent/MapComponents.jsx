import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import sendLocation from "../../APIMiddleware/APIMiddleware.js";
import UpdateMapPosition from "../../Utils/UpdateMapPosition.js";
import "./MapComponent.css";

const MapComponent = ({ state, district }) => {
  const [position, setPosition] = useState([23.5000, 80.7500]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const resultPosition = await sendLocation(state, district);
        if (resultPosition) {
          setPosition(resultPosition);
        }
      } catch (error) {
      }
    };

    if (state||district) {
      fetchLocation();
    }
  }, [state, district]);

  return (
    <MapContainer  center={position} zoom={10} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/ >
      <UpdateMapPosition position={position} />
    </MapContainer>
  );
};

export default MapComponent;
