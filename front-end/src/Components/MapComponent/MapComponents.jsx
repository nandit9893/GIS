import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import sendLocation from "../../APIMiddleware/APIMiddleware.js";
import UpdateMapPosition from "../../Utils/UpdateMapPosition.js";
import "./MapComponent.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
  "https:cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
  "https:cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
  "https:cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
});

const MapComponent = ({ state, district }) => {
  const [position, setPosition] = useState([23.5000, 80.7500]);
  const mapRef = useRef()

  const _created = e => console.log(e);

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
    <MapContainer  center={position} zoom={10} style={{ height: "500px", width: "100%" }} ref={mapRef}>
      <FeatureGroup>
        <EditControl position="topright" onCreated={_created} draw={{rectangle: true, polyline: true, polygon: true, circle: true, marker: true, circlemarker: true}}/>
      </FeatureGroup>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/ >
      <UpdateMapPosition position={position} />
    </MapContainer>
  );
};

export default MapComponent;