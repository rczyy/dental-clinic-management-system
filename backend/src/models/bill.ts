import { Schema, model } from "mongoose";

const billSchema = new Schema<Bill>({
  appointment: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export default model<Bill>("Bill", billSchema);
