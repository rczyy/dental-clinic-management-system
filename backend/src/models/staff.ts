import { Schema, model } from "mongoose";

const staffSchema = new Schema<Staff>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default model<Staff>("Staff", staffSchema);
