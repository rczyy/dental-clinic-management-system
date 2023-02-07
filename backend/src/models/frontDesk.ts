import { Schema, model } from "mongoose";

const frontDeskSchema = new Schema<FrontDesk>({
  staffId: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
  },
});

export default model<FrontDesk>("Front Desk", frontDeskSchema);
