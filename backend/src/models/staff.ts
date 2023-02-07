import { Schema, model } from "mongoose";

const staffSchema = new Schema<Staff>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default model<Staff>("Staff", staffSchema);
