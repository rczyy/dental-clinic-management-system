import { Types } from "mongoose";

declare global {
  interface Name {
    firstName: string;
    middleName: string;
    lastName: string;
  }

  interface Address {
    region: string;
    province: string;
    city: string;
    barangay: string;
    street: string;
  }

  interface User {
    _id?: Types.ObjectId;
    name: Name;
    address: Address;
    email: string;
    password: string;
    contactNo: string;
    role:
      | "Admin"
      | "Manager"
      | "Dentist"
      | "Assistant"
      | "Front Desk"
      | "Patient";
    createdAt: Date;
    updatedAt: Date;
  }

  interface Admin {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
  }

  interface Staff {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
  }

  interface Patient {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
  }

  interface Manager {
    _id?: Types.ObjectId;
    staffId: Types.ObjectId;
  }

  interface Dentist {
    _id?: Types.ObjectId;
    staffId: Types.ObjectId;
  }

  interface FrontDesk {
    _id?: Types.ObjectId;
    staffId: Types.ObjectId;
  }

  interface Assistant {
    _id?: Types.ObjectId;
    staffId: Types.ObjectId;
  }
}
