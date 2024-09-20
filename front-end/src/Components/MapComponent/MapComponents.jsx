import React, { useState, useEffect, useRef, useContext } from "react";
import { MapContainer, TileLayer, FeatureGroup, Marker, Polyline, Polygon } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import sendLocation from "../../APIMiddleware/APIMiddleware.js";
import UpdateMapPosition from "../../Utils/UpdateMapPosition.js";
import "./MapComponent.css";
import { AppContext } from "../../Context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios"; 
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapComponent = ({ state, district }) => {
  const [position, setPosition] = useState([23.5, 80.75]);
  const [hasFetched, setHasFetched] = useState(false);
  const mapRef = useRef();
  const { setUserDrawingData, getDrawingData, fetchUserDrawingData, } = useContext(AppContext);

  const _created = (e) => {
    const layer = e.layer;
    const geoJSONData = layer.toGeoJSON();
    let drawingType;
    let formattedDrawing;

    switch (geoJSONData.geometry.type) {
      case "Polygon":
        drawingType = "Polygon";
        formattedDrawing = {
          type: drawingType,
          coordinates: geoJSONData.geometry.coordinates,
        };
        break;
      case "LineString":
        drawingType = "Polyline";
        formattedDrawing = {
          type: drawingType,
          coordinates: geoJSONData.geometry.coordinates,
        };
        break;
      case "Point":
        drawingType = "Marker";
        formattedDrawing = {
          type: drawingType,
          coordinates: geoJSONData.geometry.coordinates,
        };
        break;
      default:
        return;
    }
    if (formattedDrawing) {
      setUserDrawingData((prev) => [...prev, formattedDrawing]);
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const resultPosition = await sendLocation(state, district);
        if (resultPosition) {
          setPosition(resultPosition);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (state || district) {
      fetchLocation();
      fetchUserDrawingData();
      setHasFetched(true);
    }
  }, [state, district, hasFetched]); 

  return (
    <MapContainer center={position} zoom={10} style={{ height: "500px", width: "100%" }} ref={mapRef}>
      <FeatureGroup>
        <EditControl position="topright" onCreated={_created} draw={{ rectangle: true, polyline: true, polygon: true, circle: true, marker: true, circlemarker: true }} />
      </FeatureGroup>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
      {
        getDrawingData.map((drawing) => {
          const { type, coordinates, _id } = drawing;

          if (type === "Marker") {
            return <Marker key={_id} position={[coordinates[1], coordinates[0]]} />;
          }
          if (type === "Polyline") {
            return <Polyline key={_id} positions={coordinates.map(coord => [coord[1], coord[0]])} />;
          }
          if (type === "Polygon") {
            return <Polygon key={_id} positions={coordinates[0].map(coord => [coord[1], coord[0]])} />;
          }
          return null;
        })
      }
      <UpdateMapPosition position={position} />
    </MapContainer>
  );
};

export default MapComponent;
