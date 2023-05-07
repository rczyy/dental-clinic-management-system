import { Schema, model } from "mongoose";

const requestTokenSchema = new Schema<RequestToken>({
  token: String,
});

export default model<RequestToken>("Request Token", requestTokenSchema);
