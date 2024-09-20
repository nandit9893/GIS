import mongoose, { Schema } from "mongoose";

const drawingSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ["Polygon", "Polyline", "Marker", "Circle", "Rectangle"],
  },
  coordinates: {
    type: Schema.Types.Mixed,
    required: true,
  },
  properties: {
    radius: Number,
  },
});

const userDrawingSchema = new Schema({
  userID: {
    type: String,
    required: true,
  },
  drawings: [drawingSchema],
});

export const UserDrawing = mongoose.model("UserDrawing", userDrawingSchema);
