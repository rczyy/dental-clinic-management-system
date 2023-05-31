import { Schema, model } from "mongoose";

const appointmentSchema = new Schema<Appointment>({
  dentist: {
    type: Schema.Types.ObjectId,
    ref: "Dentist",
    required: true,
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  dateTimeScheduled: { type: Date, required: true },
  dateTimeFinished: { type: Date, required: true },
  isFinished: {
    type: Boolean,
    default: false,
  },
});

export default model<Appointment>("Appointment", appointmentSchema);
