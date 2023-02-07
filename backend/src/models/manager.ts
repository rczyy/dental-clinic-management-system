import { Schema, model } from "mongoose";

const managerSchema = new Schema<Manager>({
  staffId: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
  },
});

export default model<Manager>("Manager", managerSchema);
