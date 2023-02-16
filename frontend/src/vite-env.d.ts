/// <reference types="vite/client" />

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

interface SelectOption {
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

interface UserResponse {
  _id?: string;
  name: Name;
  address: Address;
  email: string;
  password: string;
  contactNo: string;
  role: Roles;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminResponse {
  _id?: string;
  userId: string;
}

interface StaffResponse {
  _id?: string;
  userId: string;
}

interface PatientResponse {
  _id?: string;
  userId: string;
}

interface ManagerResponse {
  _id?: string;
  staffId: string;
}

interface DentistResponse {
  _id?: string;
  staffId: string;
}

interface FrontDeskResponse {
  _id?: string;
  staffId: string;
}

interface AssistantResponse {
  _id?: string;
  staffId: string;
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
