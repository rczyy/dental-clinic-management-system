import { Types } from "mongoose";
import { Roles } from "./constants";

declare module "express-session" {
  interface SessionData {
    uid: Types.ObjectId;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string;
      SESSION_SECRET: string;
      NODE_ENV: "development" | "production";
    }
  }

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

  interface ErrorBody {
    formErrors?: string[];
    fieldErrors?: {
      [key: string]: string[];
    };
  }

  interface User {
    _id?: Types.ObjectId;
    name: Name;
    address: Address;
    email: string;
    password: string;
    contactNo: string;
    role: Roles;
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
