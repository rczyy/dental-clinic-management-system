import { Schema, model } from "mongoose";

const patientSchema = new Schema<Patient>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default model<Patient>("Patient", patientSchema);
