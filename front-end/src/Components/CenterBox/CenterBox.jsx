import React, { useContext, useRef, useEffect, useState } from "react";
import "./CenterBox.css";
import defaultindian from "../../assets/defaultindian.jpg";
import plus from "../../assets/plus.jpeg";
import minus from "../../assets/minus.jpeg";
import Footer from "../Footer/Footer";
import { AppContext } from "../../Context/AppContext";
import MapComponent from "../MapComponent/MapComponents";

const CenterBox = () => {
  const { state, district, tool, isDarkMode, drawings, setDrawings } =
    useContext(AppContext);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragStart, setDragStart] = useState(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const indianMap = document.querySelector(".indian-map img");

    const resizeCanvas = () => {
      canvas.width = indianMap.clientWidth * zoomLevel;
      canvas.height = indianMap.clientHeight * zoomLevel;
      const ctx = canvas.getContext("2d");
      ctx.lineCap = "round";
      ctx.lineWidth = 5;
      ctxRef.current = ctx;
      loadDrawing();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [zoomLevel]);

  const startDrawing = (e) => {
    const ctx = ctxRef.current;
    const { offsetX, offsetY } = getMousePosition(e);

    if (isInDrawingArea(offsetX, offsetY)) {
      ctx.beginPath();
      setStartPos({ x: offsetX, y: offsetY });
      setIsDrawing(true);
    }
  };

  const finishDrawing = (e) => {
    const ctx = ctxRef.current;
    if (!isDrawing) return;

    const { offsetX, offsetY } = getMousePosition(e);

    switch (tool) {
      case "line":
        drawLine(ctx, startPos.x, startPos.y, offsetX, offsetY);
        break;
      case "triangle":
        drawTriangle(ctx, startPos.x, startPos.y, offsetX, offsetY);
        break;
      case "square":
        drawSquare(ctx, startPos.x, startPos.y, offsetX, offsetY);
        break;
      case "circle":
        drawCircle(ctx, startPos.x, startPos.y, offsetX, offsetY);
        break;
      case "hexagon":
        drawHexagon(ctx, startPos.x, startPos.y, offsetX, offsetY);
        break;
      default:
        break;
    }

    setIsDrawing(false);
    saveDrawing();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    const { offsetX, offsetY } = getMousePosition(e);

    if (tool === "pencil") {
      ctx.strokeStyle = "rgba(100, 100, 100, 0.5)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    } else if (tool === "eraser") {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 10;
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }
  };

  const drawLine = (ctx, x1, y1, x2, y2) => {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  const drawTriangle = (ctx, x1, y1, x2, y2) => {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x1, y2);
    ctx.closePath();
    ctx.stroke();
  };

  const drawSquare = (ctx, x1, y1, x2, y2) => {
    const side = Math.min(Math.abs(x2 - x1), Math.abs(y2 - y1));
    ctx.strokeRect(x1, y1, side, side);
  };

  const drawCircle = (ctx, x1, y1, x2, y2) => {
    const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    ctx.beginPath();
    ctx.arc(x1, y1, radius, 0, Math.PI * 2);
    ctx.stroke();
  };

  const drawHexagon = (ctx, x1, y1, x2, y2) => {
    const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const sides = 6;
    const angle = (2 * Math.PI) / sides;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const x = x1 + radius * Math.cos(i * angle);
      const y = y1 + radius * Math.sin(i * angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  };

  const isInDrawingArea = (x, y) => {
    const canvas = canvasRef.current;
    return x >= 0 && y >= 0 && x <= canvas.width && y <= canvas.height;
  };

  const getMousePosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: (e.clientX - rect.left) / zoomLevel,
      offsetY: (e.clientY - rect.top) / zoomLevel,
    };
  };

  const zoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 3));
  };

  const zoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 1));
  };

  const handleMouseDown = (e) => {
    if (!isDrawing) {
      setDragStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (dragStart && !isDrawing) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setTransform((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDragStart(null);
  };
  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const drawing = canvas.toDataURL();
    const updatedDrawings = [...drawings, drawing];
    setDrawings(updatedDrawings);
    localStorage.setItem("drawingData", JSON.stringify(updatedDrawings)); // Update local storage
  };

  const loadDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawings.forEach((drawing) => {
      const img = new Image();
      img.src = drawing;
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", finishDrawing);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", finishDrawing);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDrawing, tool, zoomLevel, transform, drawings]);
  return (
    <div
      className={state !== "None" ? "center-none" : "center"}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {state === "None" && (
        <div className="zoom-controls">
          <button onClick={zoomIn}>
            <img src={plus} alt="Zoom In" />
          </button>
          <button onClick={zoomOut}>
            <img src={minus} alt="Zoom Out" />
          </button>
        </div>
      )}
      <div className={`center-details ${isDarkMode ? "invert" : ""}`}>
        {state !== "None" ? (
          <MapComponent
            state={state}
            district={district === "None" ? "" : district}
          />
        ) : (
          <div
            className="indian-map"
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${zoomLevel})`,
              pointerEvents: "none",
            }}
            onMouseDown={handleMouseDown}
          >
            <img
              src={defaultindian}
              alt="India map"
              className="center-image"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="drawing-canvas"
          onMouseDown={(e) => {
            e.stopPropagation();
            startDrawing(e);
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            finishDrawing(e);
          }}
          onMouseMove={(e) => {
            e.stopPropagation();
            draw(e);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            finishDrawing(e);
          }}
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "top left",
          }}
        />
      </div>
      <div className="center-elements">
        <Footer />
      </div>
    </div>
  );
};

export default CenterBox;
