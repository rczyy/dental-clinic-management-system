import { Schema, model } from "mongoose";

const prescriptionSchema = new Schema<Prescription>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    prescriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    dose: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<Prescription>("Prescription", prescriptionSchema);
