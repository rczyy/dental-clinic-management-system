import { Schema, model } from "mongoose";

const attendanceSchema = new Schema<Attendance>({
  staff: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  timeIn: Date,
  timeOut: Date,
  date: Date,
});

export default model<Attendance>("Attendance", attendanceSchema)
