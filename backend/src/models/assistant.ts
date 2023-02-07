import { Schema, model } from "mongoose";

const assistantSchema = new Schema<Assistant>({
  staffId: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
  },
});

export default model<Assistant>("Assistant", assistantSchema);
