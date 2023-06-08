export enum Roles {
  Admin = "Admin",
  Manager = "Manager",
  Assistant = "Assistant",
  Dentist = "Dentist",
  FrontDesk = "Front Desk",
  Patient = "Patient"
}
export enum ServiceCategory {
  FirstAppointment = "First Appointment",
  Restoration = "Restoration",
  Cosmetic = "Cosmetic",
  RootCanal = "Root Canal Treatment",
  CrownsBridges = "Crowns and Bridges",
  Oral = "Oral Surgery or Extractions",
  Dentures = "Dentures",
  Orthodontics = "Orthodontics (Braces)"
}

export const LogModule = [
  "USER",
  "APPOINTMENT",
  "DENTIST'S SCHEDULE",
  "ATTENDANCE",
  "SERVICE",
  "BILLING"
] as const;

export const LogType = ["CREATE", "UPDATE", "DELETE", "RECOVER", "VERIFY"] as const;

export const HOST_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:5173" : "";
