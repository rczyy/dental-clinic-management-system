import { Schema, model } from "mongoose";

const serviceSchema = new Schema<Service>({
  name: String,
  estimatedTime: String,
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
  },
});

export default model<Service>("Service", serviceSchema);
