import { Schema, model } from "mongoose";

const serviceSchema = new Schema<Service>({
  name: {
    type: String,
    required: true,
  },
  estimatedTime: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "First Appointment",
      "Restoration",
      "Cosmetic",
      "Root Canal Treatment",
      "Crowns and Bridges",
      "Oral Surgery or Extractions",
      "Dentures",
      "Orthodontics (Braces)",
    ],
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export default model<Service>("Service", serviceSchema);
