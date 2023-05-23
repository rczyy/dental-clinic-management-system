import { Types } from "mongoose";
import { Roles, ServiceCategory } from "./constants";

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
  }

  interface Admin {
    _id: Types.ObjectId;
    user: Types.ObjectId;
  }

  interface Staff {
    _id: Types.ObjectId;
    user: Types.ObjectId;
  }

  interface Patient {
    _id: Types.ObjectId;
    user: Types.ObjectId;
  }

  interface Manager {
    _id: Types.ObjectId;
    staff: Types.ObjectId;
  }

  interface Dentist {
    _id: Types.ObjectId;
    staff: Types.ObjectId;
  }

  interface FrontDesk {
    _id: Types.ObjectId;
    staff: Types.ObjectId;
  }

  interface Assistant {
    _id: Types.ObjectId;
    staff: Types.ObjectId;
  }

  interface Service {
    _id: Types.ObjectId;
    category: ServiceCategory;
    name: string;
    estimatedTime: string;
  }

  interface EmailRequest {
    _id: Types.ObjectId;
    token?: string;
    email?: string;
    createdAt: Date;
    updatedAt: Date;
  }
}
