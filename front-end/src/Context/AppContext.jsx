import { createContext, useState } from "react";

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
  };

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
