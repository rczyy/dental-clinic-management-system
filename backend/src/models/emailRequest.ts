import { Schema, model } from "mongoose";

const emailRequestSchema = new Schema<EmailRequest>(
  {
    token: String,
    email: String,
  },
  {
    timestamps: true,
  }
);

export default model<EmailRequest>("Email Request", emailRequestSchema);
