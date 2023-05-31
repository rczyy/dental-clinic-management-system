import { Schema, model } from "mongoose";

const userSchema = new Schema<User>(
  {
    name: {
      firstName: {
        type: String,
        required: true,
      },
      middleName: {
        type: String,
        required: false,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    address: {
      region: {
        type: String,
        required: false,
      },
      province: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      barangay: {
        type: String,
        required: false,
      },
      street: {
        type: String,
        required: false,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    contactNo: {
      type: String,
      required: false,
    },
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
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://at-dental-home-bucket.s3.ap-southeast-1.amazonaws.com/avatars/blank-profile-picture.png",
    },
  },
  {
    timestamps: true,
  }
);

export default model<User>("User", userSchema);
