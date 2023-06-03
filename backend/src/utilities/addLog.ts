import { LogModule } from "../constants";
import { Types } from "mongoose";
import Log from "../models/log";
import dayjs from "dayjs";
import Patient from "../models/patient";
import Dentist from "../models/dentist";
import Staff from "../models/staff";

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

  if (module === LogModule[0]) { //USER MODULE LOGS
    const {
      name: { firstName, lastName },
      email
    } = payload as PatientPayload;

    action = `${prefix} a ${role}: Name: ${firstName} ${lastName}, Email: ${email}`;
  } else if (module === LogModule[1]) { //APPOINTMENT MODULE LOGS
    const {
      user: {
        email: patientEmail,
        name: { firstName: patientFirstName, lastName: patientLastName }
      }
    } = (await Patient.findById((payload as Appointment).patient).populate({
      path: "user",
      select: "name email"
    })) as unknown as UserPayload;
    const {
      staff: {
        user: {
          email: dentistEmail,
          name: { firstName: dentistFirstName, lastName: dentistLastName }
        }
      }
    } = (await Dentist.findById((payload as Appointment).dentist).populate({
      path: "staff",
      populate: { path: "user", select: "name email" }
    })) as unknown as StaffPayload;

    action = `${prefix} an Appointment: 
    Patient: ${patientFirstName} ${patientLastName} ${patientEmail}, 
    Dentist: ${dentistFirstName} ${dentistLastName} ${dentistEmail}, 
    Schedule: ${dayjs((payload as Appointment).dateTimeScheduled).format(
      "MMM/DD/YY h:mm A"
    )}`;
  } else if (module === LogModule[2]) { //DENTIST'S SCHEDULE MODULE LOGS
    const {
      staff: {
        user: {
          email,
          name: { firstName, lastName }
        }
      }
    } = (await Dentist.findById(payload).populate({
      path: "staff",
      populate: { path: "user", select: "name email" }
    })) as unknown as StaffPayload;

    action = `${prefix} Dentist's schedule: ${firstName} ${lastName} ${email}`;
  } else if (module === LogModule[3]) { //ATTENDANCE MODULE LOGS
    //get staff
    //destructure payload
    action = `${prefix} an Attendance: Name: , Time in: , Time out: `;
  } else if (module === LogModule[4]) { //SERVICE MODULE LOGS
    const { category, estimatedTime, name } = payload as Service;
    action = `${prefix} a Service: Name: ${name}, Estimated time: ${estimatedTime}mins Category: ${category}`;
  }

  console.log({
    date: dayjs().format("MMM DD, YYYY hh:mm A"),
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
