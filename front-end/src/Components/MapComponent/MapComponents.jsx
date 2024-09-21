import React, { useState, useEffect, useRef, useContext } from "react";
import { MapContainer, TileLayer, FeatureGroup, Polygon, Polyline, Marker, Circle, CircleMarker} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import sendLocation from "../../APIMiddleware/APIMiddleware.js";
import UpdateMapPosition from "../../Utils/UpdateMapPosition.js";
import { AppContext } from "../../Context/AppContext.jsx";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapComponent = ({ state, district }) => {
  const [position, setPosition] = useState([23.5, 80.75]);
  const mapRef = useRef();
  const { setUserDrawingData, fetchUserDrawingData, getDrawingData } = useContext(AppContext);
  const _created = (e) => {
    const layer = e.layer;
    const geoJSONData = layer.toGeoJSON();
    let drawingType;
    let formattedDrawing;
    switch (layer instanceof L.Circle) 
    {
      case true:
        drawingType = "Circle";
        formattedDrawing = {
          type: drawingType,
          center: geoJSONData.geometry.coordinates,
          radius: layer.getRadius(),
        };
        break;
      case false:
        switch (layer instanceof L.CircleMarker) 
        {
          case true:
            drawingType = "CircleMarker";
            formattedDrawing = {
              type: drawingType,
              center: geoJSONData.geometry.coordinates,
              radius: layer.getRadius(),
            };
            break;
          case false:
            switch (layer instanceof L.Marker) 
            {
              case true:
                drawingType = "Marker";
                formattedDrawing = {
                  type: drawingType,
                  coordinates: geoJSONData.geometry.coordinates,
                };
                break;
              default:
                switch (geoJSONData.geometry.type) 
                {
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
                    drawingType = "Point";
                    formattedDrawing = {
                      type: drawingType,
                      coordinates: geoJSONData.geometry.coordinates,
                    };
                    break;
                  case "Rectangle":
                    drawingType = "Rectangle";
                    formattedDrawing = {
                      type: drawingType,
                      coordinates: geoJSONData.geometry.coordinates,
                    };
                    break;
                  default:
                    return;
                }
            }
        }
    }

    if (formattedDrawing) {
      setUserDrawingData((prev) => [...prev, formattedDrawing]);
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const resultPosition = await sendLocation(state, district);
        if (resultPosition && (position[0] !== resultPosition[0] || position[1] !== resultPosition[1])) {
          setPosition(resultPosition);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (state || district) {
      fetchLocation();
      fetchUserDrawingData();
    }
  }, [state, district, fetchUserDrawingData]);

  const renderDrawings = () => {
    return getDrawingData.map((drawing) => {
      switch (drawing.type) {
        case "Circle":
          return (
            <Circle
              key={drawing._id}
              center={drawing.center}
              radius={drawing.radius}
            />
          );
        case "CircleMarker":
          return (
            <CircleMarker
              key={drawing._id}
              center={drawing.center}
              radius={drawing.radius}
            />
          );
        case "Polygon":
          return (
            <Polygon
              key={drawing._id}
              positions={drawing.coordinates[0]} // Ensure it's a 2D array
            />
          );
        case "Polyline":
          return (
            <Polyline
              key={drawing._id}
              positions={drawing.coordinates.map(coord => [coord[0], coord[1]])} // Ensure it's in the correct format
            />
          );
        case "Marker":
          return (
            <Marker
              key={drawing._id}
              position={drawing.coordinates}
            />
          );
        case "Rectangle":
          return (
            <Polygon
              key={drawing._id}
              positions={drawing.coordinates[0]} // Rectangles as Polygons
            />
          );
        default:
          return null;
      }
    });
  };
  

  return (
    <MapContainer center={position} zoom={15} style={{ height: "500px", width: "100%" }} ref={mapRef} >
      <FeatureGroup>
        <EditControl position="topright" onCreated={_created} draw={{ rectangle: true, polyline: true, polygon: true, circle: true, marker: true, circlemarker: true }} />
      </FeatureGroup>
      {renderDrawings()}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
      <UpdateMapPosition position={position} />
    </MapContainer>
  );
};

export default MapComponent;
