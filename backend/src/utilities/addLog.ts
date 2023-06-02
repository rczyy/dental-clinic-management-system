import { LogModule, LogType } from "../constants";
import { Types } from "mongoose";
import Log from "../models/log";
import dayjs from "dayjs";
import User from "../models/user";
import Patient from "../models/patient";
import Dentist from "../models/dentist";

// LogModule ["USER", "APPOINTMENT", "DENTIST'S SCHEDULE", "ATTENDANCE", "SERVICE"]
// LogType ["CREATE", "UPDATE", "DELETE"]

type StaffPayload = {
  staff: {
    user: {
      name: {
        firstName: string;
        middleName: string;
        lastName: string;
      };
      email: string;
    };
  };
};

type UserPayload = {
  user: {
    name: {
      firstName: string;
      middleName: string;
      lastName: string;
    };
    email: string;
  };
};

type PatientPayload = {
  name: {
    firstName: string;
    middleName: string;
    lastName: string;
  };
  email: string;
};

export const addLog = async (
  user: Types.ObjectId | string,
  module: string,
  type: string,
  payload: object | string | Types.ObjectId,
  role = "User"
) => {
  const prefix = `${
    type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
  }d`;
  let action = "";

  if (module === LogModule[0]) {
    action = `${prefix} a ${role}: ${
      (payload as PatientPayload).name.firstName
    } ${(payload as PatientPayload).name.lastName} ${
      (payload as PatientPayload).email
    }`;
  } else if (module === LogModule[1]) {
    const patient = await Patient.findById(
      (payload as Appointment).patient
    ).populate({
      path: "user",
      select: "name email"
    });
    const dentist = await Dentist.findById(
      (payload as Appointment).dentist
    ).populate({
      path: "staff",
      populate: { path: "user", select: "name email" }
    });

    if (!patient || !dentist) return;

    action = `${prefix} an Appointment: Patient: ${
      (patient as unknown as UserPayload).user.name.firstName
    } ${(patient as unknown as UserPayload).user.name.lastName} ${
      (patient as unknown as UserPayload).user.email
    } Dentist: ${
      (dentist as unknown as StaffPayload).staff.user.name.firstName
    } ${(dentist as unknown as StaffPayload).staff.user.name.lastName} ${
      (dentist as unknown as StaffPayload).staff.user.email
    } Schedule: ${dayjs((payload as Appointment).dateTimeScheduled).format(
      "MMM/DD/YY h:mm A"
    )}`;
  } else if (module === LogModule[2]) {
    const dentist = await Dentist.findById(payload).populate({
      path: "staff",
      populate: { path: "user", select: "name email" }
    });
    action = `${prefix} Dentist's schedule: ${
      (dentist as unknown as StaffPayload).staff.user.name.firstName
    } ${(dentist as unknown as StaffPayload).staff.user.name.lastName} ${
      (dentist as unknown as StaffPayload).staff.user.email
    }`;
  } else if (module === LogModule[3]) {
  } else if (module === LogModule[4]) {
    action = `${prefix} a Service: Name: ${
      (payload as Service).name
    } Estimated time: ${(payload as Service).estimatedTime} Category: ${
      (payload as Service).category
    }`;
  }

  console.log({
    date: dayjs(),
    module,
    user,
    type,
    action
  });

    const logToAdd = new Log({
      date: dayjs(),
      module,
      user,
      type,
      action
    });

    await logToAdd.save();
};
