import { Schema, model } from "mongoose";

const frontDeskSchema = new Schema<FrontDesk>({
  staff: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export default model<FrontDesk>("Front Desk", frontDeskSchema);
