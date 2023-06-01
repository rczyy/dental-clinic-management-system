import { Schema, model } from "mongoose";

const staffSchema = new Schema<Staff>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export default model<Staff>("Staff", staffSchema);
