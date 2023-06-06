import { LogModule } from "../constants";
import { Types } from "mongoose";
import Log from "../models/log";
import dayjs from "dayjs";
import Patient from "../models/patient";
import Dentist from "../models/dentist";
import Staff from "../models/staff";
import Appointment from "../models/appointment";
import { commafy } from "./commafy";

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

type AppointmentPayload = {
  patient: {
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

export const addLog = async (
  user: Types.ObjectId | string,
  module: string,
  type: string,
  payload: object | string | Types.ObjectId,
  role = "User"
) => {
  let action = `${
    type === "VERIFY"
      ? "Verified"
      : type === "RECOVER"
      ? "Recovered"
      : type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() + "d"
  } `;

  switch (module) {
    case LogModule[0]:
      action += addUserLog(payload, role);
      break;
    case LogModule[1]:
      action += await addAppointmentLog(payload);
      break;
    case LogModule[2]:
      action += await addDentistScheduleLog(payload);
      break;
    case LogModule[3]:
      action += await addAttendanceLog(payload);
      break;
    case LogModule[4]:
      action += addServiceLog(payload);
      break;
    case LogModule[5]:
      action += await addBillLog(payload);
      break;
    default:
      action = "Error occurred";
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

export const addUserLog = (
  payload: object | string | Types.ObjectId,
  role: string
) => {
  const {
    name: { firstName, lastName },
    email
  } = payload as PatientPayload;

  return `a ${role}: Name: ${firstName} ${lastName}, Email: ${email}`;
};

export const addAppointmentLog = async (
  payload: object | string | Types.ObjectId
) => {
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

  return `an Appointment: Patient: ${patientFirstName} ${patientLastName} ${patientEmail}, Dentist: ${dentistFirstName} ${dentistLastName} ${dentistEmail}, Schedule: ${dayjs(
    (payload as Appointment).dateTimeScheduled
  ).format("MMM/DD/YY h:mm A")}`;
};

export const addDentistScheduleLog = async (
  payload: object | string | Types.ObjectId
) => {
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

  return `Dentist's schedule: ${firstName} ${lastName} ${email}`;
};

export const addAttendanceLog = async (
  payload: object | string | Types.ObjectId
) => {
  const { staff, timeIn, timeOut } = payload as unknown as Attendance;

  const {
    user: {
      email,
      name: { firstName, lastName }
    }
  } = (await Staff.findById(staff).populate({
    path: "user",
    select: "name email"
  })) as unknown as UserPayload;
  return `an Attendance: Name: ${firstName} ${lastName} Email: ${email}, Time in: ${dayjs(
    timeIn
  ).format("h:mm A")}, Time out: ${
    timeOut !== null ? dayjs(timeOut).format("h:mm A") : ""
  }`;
};

export const addServiceLog = (payload: object | string | Types.ObjectId) => {
  const { category, estimatedTime, name } = payload as Service;
  return `a Service: Name: ${name}, Estimated time: ${estimatedTime} (min) Category: ${category}`;
};

export const addBillLog = async (payload: object | string | Types.ObjectId) => {
  const bill = payload as unknown as Bill;
  const {
    patient: {
      user: {
        email,
        name: { firstName, lastName }
      }
    }
  } = (await Appointment.findById(bill.appointment).populate({
    path: "patient",
    populate: { path: "user", select: "name email" }
  })) as unknown as AppointmentPayload;
  return `a Bill: Patient: ${firstName} ${lastName}, Email: ${email}, Note: ${
    bill.notes
  }, Bill: ₱${commafy(bill.price.toFixed(2))}`;
};
