import { Schema, model } from "mongoose";

const dentistSchema = new Schema<Dentist>({
  staffId: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
  },
});

export default model<Dentist>("Dentist", dentistSchema);
