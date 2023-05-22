import { Schema, model } from "mongoose";

const assistantSchema = new Schema<Assistant>({
  staff: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
});

export default model<Assistant>("Assistant", assistantSchema);
