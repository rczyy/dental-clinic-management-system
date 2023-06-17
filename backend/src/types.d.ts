import { Types } from "mongoose";
import { Roles, ServiceCategory } from "./constants";
import { Dayjs } from "dayjs";
declare module "express-session" {
  interface SessionData {
    uid: string;
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
      MJ_API_KEY: string;
      MJ_SECRET_KEY: string;
      EMAIL_SENDER: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
    }
  }

  interface Name {
    firstName: string;
    middleName?: string;
    lastName: string;
  }

  interface Address {
    region?: string;
    province?: string;
    city?: string;
    barangay?: string;
    street?: string;
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
    _id: Types.ObjectId;
    name: Name;
    address?: Address;
    email: string;
    password?: string;
    contactNo?: string;
    role: Roles;
    verified: boolean;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
  }

  interface Admin {
    _id: Types.ObjectId;
    user: Types.ObjectId;
  }

  interface Staff {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    isDeleted: boolean;
  }

  interface Patient {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    isDeleted: boolean;
    isBanned: boolean;
  }

  interface Manager {
    _id: Types.ObjectId;
    staff: Types.ObjectId;
    isDeleted: boolean;
  }

  interface Dentist {
    _id: Types.ObjectId;
    staff: Types.ObjectId;
    isDeleted: boolean;
  }

  interface FrontDesk {
    _id: Types.ObjectId;
    staff: Types.ObjectId;
    isDeleted: boolean;
  }

  interface Assistant {
    _id: Types.ObjectId;
    staff: Types.ObjectId;
    isDeleted: boolean;
  }

  interface Service {
    _id: Types.ObjectId;
    category: ServiceCategory;
    name: string;
    estimatedTime: string;
    isDeleted: boolean;
  }

  interface Appointment {
    _id?: Types.ObjectId;
    dateTimeScheduled: Date;
    dateTimeFinished: Date;
    patient: Types.ObjectId;
    dentist: Types.ObjectId;
    service: Types.ObjectId;
    isFinished: boolean;
  }

  interface Attendance {
    _id?: Types.ObjectId;
    timeIn: Date;
    timeOut: Date;
    date: Date;
    staff: Types.ObjectId;
  }

  interface EmailRequest {
    _id: Types.ObjectId;
    token?: string;
    email?: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface DentistSchedule {
    _id: Types.ObjectId;
    dentist: Types.ObjectId;
    date: Date;
  }

  interface Log {
    date: Dayjs;
    module: string;
    user: Types.ObjectId;
    type: string;
    action: string;
  }

  interface Notification {
    _id: Types.ObjectId;
    description: string;
    type: "Appointment";
    isRead: boolean;
    to: Types.ObjectId;
    from: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Bill {
    _id: Types.ObjectId;
    appointment: Types.ObjectId;
    notes?: string;
    price: number;
    isDeleted: boolean;
  }

  interface PatientCondition {
    _id: Types.ObjectId;
    patient: Types.ObjectId;
    condition: string;
    conditionType: string;
  }

  interface Prescription {
    _id: Types.ObjectId;
    patient: Types.ObjectId;
    prescriber: Types.ObjectId;
    name: string;
    dose: string;
    frequency: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface PatientFile {
    _id: Types.ObjectId;
    patient: Types.ObjectId;
    bill?: Types.ObjectId;
    name: string;
    size: number;
    file: string;
    createdAt: Date;
    updatedAt: Date;
  }
}
