import { Schema, model } from "mongoose";

const assistantSchema = new Schema<Assistant>({
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

export default model<Assistant>("Assistant", assistantSchema);
