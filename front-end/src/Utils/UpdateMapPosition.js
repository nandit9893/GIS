import { useMap } from "react-leaflet";
import { useEffect } from "react";

const UpdateMapPosition = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 10);
    }
  }, [position, map]);

  return null;
};

export default UpdateMapPosition;
