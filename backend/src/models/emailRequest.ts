import { Schema, model } from "mongoose";

const emailRequestSchema = new Schema<EmailRequest>(
  {
    token: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<EmailRequest>("Email Request", emailRequestSchema);
