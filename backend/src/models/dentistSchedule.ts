import { Schema, model } from "mongoose";

const dentistScheduleSchema = new Schema<DentistSchedule>({
  dentist: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Dentist",
  },
  date: {
    type: Date,
    required: true,
  },
});

export default model<DentistSchedule>(
  "Dentist Schedule",
  dentistScheduleSchema
);
