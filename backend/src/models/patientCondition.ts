import { Schema, model } from "mongoose";

const patientConditionSchema = new Schema<PatientCondition>({
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  conditionType: {
    type: String,
    required: true,
  },
});

export default model<PatientCondition>(
  "PatientCondition",
  patientConditionSchema
);
