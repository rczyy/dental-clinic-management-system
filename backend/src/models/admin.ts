import { Schema, model } from "mongoose";

const adminSchema = new Schema<Admin>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default model<Admin>("Admin", adminSchema);
