import { Schema, model } from "mongoose";

const managerSchema = new Schema<Manager>({
  staff: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
});

export default model<Manager>("Manager", managerSchema);
