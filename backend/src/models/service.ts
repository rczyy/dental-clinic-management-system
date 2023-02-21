import { Schema, model } from "mongoose";

const serviceSchema = new Schema<Service>({
  name: String,
  estimatedTime: String,
});

export default model<Service>("Service", serviceSchema);
