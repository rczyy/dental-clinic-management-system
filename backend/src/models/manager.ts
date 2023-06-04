import { Schema, model } from "mongoose";

const managerSchema = new Schema<Manager>({
  staff: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export default model<Manager>("Manager", managerSchema);
