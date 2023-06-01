import { z } from "zod";
import { LogModule, LogType } from "../constants";
import { isValidObjectId } from "mongoose";
import { Types } from "mongoose";
import Log from "../models/log";
import dayjs from "dayjs";
import User from "../models/user";
import Appointment from "../models/appointment";
import Patient from "../models/patient";
import Dentist from "../models/dentist";
import Attendance from "../models/Attendance";
import Service from "../models/Service";
import DentistSchedule from "../models/dentistSchedule";

// LogModule ["USER", "APPOINTMENT", "DENTIST'S SCHEDULE", "ATTENDANCE", "SERVICE"]
// LogType ["CREATE", "UPDATE", "DELETE"]

export const addLog = async (
  user: Types.ObjectId | string,
  module: string,
  type: string,
  payload:
    | Types.ObjectId
    | string
    | Appointment
    | DentistSchedule[]
    | Attendance
    | Service
    | User,
  role = "User"
) => {
  const userEmail = await User.findById(user).select("email");
  let action = "";

  if (module === LogModule[0]) {
    action = `${
      type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
    }d a ${role}: ${payload.name.firstName} ${payload.name.lastName} ${
      payload.email
    }`;
  } else if (module === LogModule[1]) {
    const patient = await Patient.findById(payload.patient).populate({
      path: "user",
      select: "name email"
    });
    const dentist = await Dentist.findById(payload.dentist).populate({
      path: "staff",
      populate: { path: "user", select: "name email" }
    });

    if (!patient || !dentist) return;
    action = `${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}d ${
      module.charAt(0).toUpperCase() + module.slice(1).toLowerCase()
    }: Patient: ${patient.user.name.firstName} ${patient.user.name.lastName} ${
      patient.user.email
    } Dentist: ${dentist.staff.user.name.firstName} ${
      dentist.staff.user.name.lastName
    } ${dentist.staff.user.email} Schedule: ${dayjs(
      payload.dateTimeScheduled
    ).format("MMM/DD/YY h:mm A")}`;
  } else if (module === LogModule[2]) {
    const dentist = await Dentist.findById(payload).populate({
      path: "staff",
      populate: { path: "user", select: "name email" }
    });
    action = `${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}d ${
        module.charAt(0).toUpperCase() + module.slice(1).toLowerCase()
      }: ${dentist.staff.user.name.firstName} ${dentist.staff.user.name.lastName} ${dentist.staff.user.email}`
  } else if (module === LogModule[3]) {
  } else if (module === LogModule[4]) {
  }

  console.log({
    date: dayjs(),
    module,
    user: userEmail && userEmail.email,
    type,
    action
  });

  //   const logToAdd = new Log({
  //     date: dayjs(),
  //     module,
  //     user: userEmail,
  //     type,
  //     action: JSON.stringify(payload)
  //   });

  //   await logToAdd.save();
};
