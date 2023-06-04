import { Schema, model } from "mongoose";

const patientSchema = new Schema<Patient>({
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

export default model<Patient>("Patient", patientSchema);
