import { Schema, model } from "mongoose";

const dentistSchema = new Schema<Dentist>({
  staff: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
});

export default model<Dentist>("Dentist", dentistSchema);
