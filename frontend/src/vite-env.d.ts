/// <reference types="vite/client" />

type ServiceCategory =
  | "First Appointment"
  | "Restoration"
  | "Cosmetic"
  | "Root Canal Treatment"
  | "Crowns and Bridges"
  | "Oral Surgery or Extractions"
  | "Dentures"
  | "Orthodontics (Braces)";

interface EditFormValues {
  firstName: string;
  middleName: string;
  lastName: string;
  role: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  street: string;
  contactNo: string;
}

interface LoginFormValues {
  email: string;
  password: string;
}

interface SignupFormValues {
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  role: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  street: string;
  password: string;
  confirmPassword: string;
  contactNo: string;
}

interface StaffSignupFormValues {
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  role: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  street: string;
  contactNo: string;
}

interface ServiceFormValues {
  category: ServiceCategory | "";
  name: string;
  estimatedTime: string;
}

interface SelectOption {
  _id?: string;
  value: string;
  label: string;
}

interface Region {
  code: string;
  name: string;
  regionName: string;
  islandGroupCode: string;
  psgc10DigitCode: string;
}

interface Province {
  code: string;
  name: string;
  regionCode: string;
  islandGroupCode: string;
  psgc10DigitCode: string;
}

interface City {
  code: string;
  districtCode: boolean;
  isCapital: boolean;
  isCity: boolean;
  isMunicipality: boolean;
  islandGroupCode: string;
  name: string;
  oldName: string;
  provinceCode: string;
  psgc10DigitCode: string;
  regionCode: string;
}

interface Barangay {
  code: string;
  name: string;
  oldName: string;
  subMunicipalityCode: boolean;
  cityCode: string;
  municipalityCode: boolean;
  districtCode: boolean;
  provinceCode: string;
  regionCode: string;
  islandGroupCode: string;
  psgc10DigitCode: string;
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

interface UserResponse {
  _id: string;
  name: Name;
  address?: Address;
  email: string;
  contactNo?: string;
  role:
    | "Admin"
    | "Manager"
    | "Assistant"
    | "Dentist"
    | "Front Desk"
    | "Patient";
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminResponse {
  _id: string;
  user: UserResponse;
}

interface StaffResponse {
  _id: string;
  user: UserResponse;
}

interface PatientResponse {
  _id: string;
  user: UserResponse;
}

interface ManagerResponse {
  _id: string;
  staff: string;
}

interface DentistResponse {
  _id: string;
  staff: StaffResponse;
}

interface FrontDeskResponse {
  _id: string;
  staff: string;
}

interface AssistantResponse {
  _id: string;
  staff: string;
}

interface MessageResponse {
  message: string;
}

interface LoginResponse {
  user: UserResponse;
  token: string;
}

interface DeleteResponse {
  _id: string;
  message: string;
}

interface FormError {
  formErrors: string[];
  fieldErrors: {
    [key: string]: string[];
  };
}

interface ErrorMessage {
  message: string;
}
interface AppointmentResponse {
  _id?: string;
  dentist: DentistResponse;
  patient: PatientResponse;
  service: ServiceResponse;
  dateTimeScheduled: string;
  dateTimeFinished: string;
}

interface DentistNamesResponse {
  _id: string;
  name: {
    firstName: string;
    lastName: string;
  };
}
interface FormErrorResponse {
  response: {
    data: FormError;
  };
}

interface ErrorMessageResponse {
  response: {
    data: ErrorMessage;
  };
}

interface ServiceResponse {
  _id: string;
  category: ServiceCategory;
  name: string;
  estimatedTime: string;
}

interface AppointmentZodFormValues {
  serviceCategory: string;
  service: string;
  dentist: string;
  date: string;
  time: string;
}

interface AppointmentFormValues {
  patient: string;
  service: string;
  dentist: string;
  dateTimeScheduled: string;
  dateTimeFinished: string;
}
