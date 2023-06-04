import { Schema, model } from "mongoose";

const attendanceSchema = new Schema<Attendance>({
  staff: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  timeIn: { type: Date, required: true },
  timeOut: { type: Date, required: false },
  date: { type: Date, required: true },
});

export default model<Attendance>("Attendance", attendanceSchema);
