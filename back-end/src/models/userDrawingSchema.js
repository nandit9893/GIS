import mongoose, { Schema } from "mongoose";

const drawingSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: [
      "Polygon",
      "Polyline",
      "Marker",
      "Circle",
      "CircleMarker",
      "Rectangle",
    ],
  },
  coordinates: {
    type: Schema.Types.Mixed,
    required: function () {
      return this.type !== "Circle" && this.type !== "CircleMarker";
    },
  },
  center: {
    type: [Number],
    required: function () {
      return this.type === "Circle" || this.type === "CircleMarker";
    },
  },
  radius: {
    type: Number,
    required: function () {
      return this.type === "Circle" || this.type === "CircleMarker";
    },
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
