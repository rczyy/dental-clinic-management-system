import { Schema, model } from "mongoose";

const dentistSchema = new Schema<Dentist>({
  staff: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
  },
});

export default model<Dentist>("Dentist", dentistSchema);
