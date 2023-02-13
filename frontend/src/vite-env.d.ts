/// <reference types="vite/client" />

interface FormValues {
  firstName: string;
  middleName: string;
  lastName: string;
  role: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  street: string;
  email: string;
  password: string;
  confirmPassword: string;
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
