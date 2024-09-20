import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
 const url = "https://gis-back-end.onrender.com";
  const [district, setDistrict] = useState("None");
  const [state, setState] = useState("None");
  const [tool, setTool] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userID, setUserID] = useState("");
  const [redoStack, setRedoStack] = useState([]);
  const [drawings, setDrawings] = useState(() => {
    const savedDrawings = localStorage.getItem("drawingData");
    try {
      return savedDrawings ? JSON.parse(savedDrawings) : [];
    } catch (error) {
      console.error("Error parsing JSON from localStorage:", error);
      return [];
    }
  });
  const [userDrawingData, setUserDrawingData] = useState([]);
  const [getDrawingData, setGetDrawingData] = useState([]); 

  const savingUserDrawingData = async () => {
    const saveDataUrl = `${url}/gis/user/save/drawing`;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        saveDataUrl,
        { newDrawings: userDrawingData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        toast.success("Tools saved successfully");
      } else {
        toast.error(response.data.message || "Failed to save tools");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during saving data"
      );
    }
  };

  const fetchUserDrawingData = async () => {
    const getDataUrl = `${url}/gis/user/get/drawings`;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(getDataUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setGetDrawingData(response.data.data.drawings);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred during fetching data"
      );
    }
  };

  const redrawCanvas = () => {
    const canvas = document.querySelector(".drawing-canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawings.forEach((drawing) => {
        const img = new Image();
        img.src = drawing;
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
      });
    }
  };

  const undo = () => {
    if (drawings.length === 0) return;
    const lastDrawing = drawings.pop();
    setRedoStack((prev) => [...prev, lastDrawing]);
    setDrawings([...drawings]);
    try {
      localStorage.setItem("drawingData", JSON.stringify(drawings));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
    redrawCanvas();
  };

  const clean = () => {
    setDrawings([]);
    setRedoStack([]);
    try {
      localStorage.removeItem("drawingData");
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
    redrawCanvas();
  };

  const contextValues = {
    url,
    district,
    setDistrict,
    state,
    setState,
    tool,
    setTool,
    isDarkMode,
    setIsDarkMode,
    userID,
    setUserID,
    drawings,
    setDrawings,
    redoStack,
    setRedoStack,
    clean,
    undo,
    userDrawingData,
    setUserDrawingData,
    savingUserDrawingData,
    getDrawingData,
    fetchUserDrawingData,
  };

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
