import { Schema, model } from "mongoose";

const patientFileSchema = new Schema<PatientFile>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    bill: {
      type: Schema.Types.ObjectId,
      ref: "Bill",
      required: false,
    },
    file: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PatientFile = model<PatientFile>("PatientFile", patientFileSchema);
