import { Types } from "mongoose";
import { Roles, ServiceCategory } from "./constants";

declare module "express-session" {
  interface SessionData {
    uid: Types.ObjectId;
  }
}

declare module "jsonwebtoken" {
  export interface RoleJwtPayload extends jwt.JwtPayload {
    role: string;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string;
      SESSION_SECRET: string;
      JWT_SECRET: string;
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

  interface FormError {
    formErrors?: string[];
    fieldErrors?: {
      [key: string]: string[];
    };
  }

  interface ErrorMessage {
    message: string;
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
    user: Types.ObjectId;
  }

  interface Staff {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
  }

  interface Patient {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
  }

  interface Manager {
    _id?: Types.ObjectId;
    staff: Types.ObjectId;
  }

  interface Dentist {
    _id?: Types.ObjectId;
    staff: Types.ObjectId;
  }

  interface FrontDesk {
    _id?: Types.ObjectId;
    staff: Types.ObjectId;
  }

  interface Assistant {
    _id?: Types.ObjectId;
    staff: Types.ObjectId;
  }

  interface Service {
    _id?: Types.ObjectId;
    category: ServiceCategory;
    name: string;
    estimatedTime: string;
  }

  interface Appointment {
    _id?: Types.ObjectId;
    dateTimeScheduled: Date;
    dateTimeFinished: Date;
    patient: Types.ObjectId;
    dentist: Types.ObjectId;
    service: Types.ObjectId;
  }
}
