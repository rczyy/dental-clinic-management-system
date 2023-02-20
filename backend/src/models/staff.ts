import { Schema, model } from "mongoose";

const staffSchema = new Schema<Staff>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default model<Staff>("Staff", staffSchema);
