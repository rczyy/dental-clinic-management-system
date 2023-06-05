import { Schema, model } from "mongoose";

const logSchema = new Schema<Log>({
  date: { type: Date, required: true },
  module: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  }
});

export default model<Log>("Log", logSchema);
