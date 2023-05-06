import { Schema, model } from "mongoose";

const userSchema = new Schema<User>(
  {
    name: {
      firstName: String,
      middleName: String,
      lastName: String,
    },
    address: {
      region: String,
      province: String,
      city: String,
      barangay: String,
      street: String,
    },
    email: String,
    password: String,
    contactNo: String,
    role: {
      type: String,
      enum: [
        "Admin",
        "Manager",
        "Dentist",
        "Assistant",
        "Front Desk",
        "Patient",
      ],
    },
    verified: Boolean,
  },
  {
    timestamps: true,
  }
);

export default model<User>("User", userSchema);
