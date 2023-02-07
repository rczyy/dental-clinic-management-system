import { Schema, model } from "mongoose";

const adminSchema = new Schema<Admin>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default model<Admin>("Admin", adminSchema);
