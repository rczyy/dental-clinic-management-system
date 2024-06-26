import { RequestHandler } from "express";
import { verifyToken } from "../utilities/verifyToken";
import { z } from "zod";
import { LogModule, LogType, Roles } from "../constants";
import { isValidObjectId } from "mongoose";
import { addLog } from "../utilities/addLog";
import Appointment from "../models/appointment";
import Patient from "../models/patient";
import Dentist from "../models/dentist";
import Service from "../models/service";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Staff from "../models/staff";
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Hong_Kong");

export const getAppointments: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role === Roles.Patient) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const querySchema = z.object({
    date: z.coerce.date().optional(),
    includeBilled: z.coerce.boolean().optional(),
  });

  const queryParse = querySchema.safeParse(req.query);

  if (!queryParse.success) {
    res.status(400).send(queryParse.error.flatten());
    return;
  }

  const { date, includeBilled } = req.query;

  const appointments = await Appointment.find({
    ...(date && {
      dateTimeScheduled: {
        $gte: dayjs(date.toString()),
        $lt: dayjs(date.toString()).format("YYYY-MM-DDT23:59:59"),
      },
    }),
    ...(includeBilled === "false" && {
      isFinished: false,
    }),
  })
    .populate({
      path: "dentist",
      populate: {
        path: "staff",
        populate: {
          path: "user",
        },
      },
    })
    .populate({
      path: "patient",
      populate: {
        path: "user",
      },
    })
    .populate({ path: "service" });

  res.status(200).json(appointments);
};

export const addAppointment: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  const appointmentSchema = z
    .object({
      dentist: z.string({ required_error: "Dentist is required" }),
      patient: z.string({ required_error: "Patient is required" }),
      service: z.string({ required_error: "Service is required" }),
      dateTimeScheduled: z.string({
        required_error: "Date and time scheduled is required",
      }),
      dateTimeFinished: z.string({
        required_error: "Date and time finished is required",
      }),
    })
    .refine(({ dentist }) => isValidObjectId(dentist), {
      message: "Invalid dentist user ID",
      path: ["dentist"],
    })
    .refine(({ patient }) => isValidObjectId(patient), {
      message: "Invalid patient user ID",
      path: ["patient"],
    })
    .refine(({ service }) => isValidObjectId(service), {
      message: "Invalid service ID",
      path: ["service"],
    });

  type body = z.infer<typeof appointmentSchema>;

  const parse = appointmentSchema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).json(parse.error.flatten());
    return;
  }

  const { dentist, patient, service, dateTimeScheduled, dateTimeFinished }: body = req.body;

  if (token.role === Roles.Patient && req.session.uid !== patient) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  if (!isValidObjectId(dentist)) {
    const error: ErrorMessage = { message: "Invalid dentist ID" };
    res.status(400).json(error);
    return;
  }

  if (!isValidObjectId(patient)) {
    const error: ErrorMessage = { message: "Invalid patient ID" };
    res.status(400).json(error);
    return;
  }

  if (!isValidObjectId(service)) {
    const error: ErrorMessage = { message: "Invalid service ID" };
    res.status(400).json(error);
    return;
  }

  const existingStaff = await Staff.findOne({ user: dentist });

  if (!existingStaff) {
    res.status(400).send({ message: "Dentist doesn't exist" });
    return;
  }

  const dentistSelected = await Dentist.findOne({ staff: existingStaff._id });

  if (!dentistSelected) {
    res.status(400).send({ message: "Dentist doesn't exist" });
    return;
  }

  const patientSelected = await Patient.findOne({ user: patient });

  if (!patientSelected) {
    res.status(400).send({ message: "Patient does not exist" });
    return;
  }

  const serviceSelected = await Service.findById(service);

  if (!serviceSelected) {
    const error: ErrorMessage = { message: "Service doesn't exist" };
    res.status(400).json(error);
    return;
  }

  const patientAppointmentDates = await Appointment.find({
    patient: patientSelected._id,
  }).select("dateTimeScheduled dateTimeFinished");
  const dentistAppointmentDates = await Appointment.find({
    dentist: serviceSelected._id,
  }).select("dateTimeScheduled dateTimeFinished");

  const allAppointments = patientAppointmentDates
    .concat(dentistAppointmentDates)
    .filter(
      (appointment, index, arr) => index === arr.findIndex((t) => t._id.equals(appointment._id))
    );

  if (allAppointments && allAppointments.length > 0)
    for (let i = 0; i < allAppointments.length; i++) {
      const timeStart = dayjs(dateTimeScheduled);
      const timeEnd = dayjs(dateTimeFinished);

      const appointment = allAppointments[i];
      const appointmentTimeStart = appointment && dayjs(appointment.dateTimeScheduled);
      const appointmentTimeEnd = appointment && dayjs(appointment.dateTimeFinished);

      if (
        timeStart.isBetween(appointmentTimeStart, appointmentTimeEnd, "minute", "[)") ||
        timeEnd.isBetween(appointmentTimeStart, appointmentTimeEnd, "minute", "(]") ||
        (timeStart.isBefore(appointmentTimeStart, "minute") &&
          timeEnd.isAfter(appointmentTimeEnd, "minute"))
      ) {
        const error: ErrorMessage = { message: "Schedule is not available" };
        res.status(400).json(error);
        return;
      }
    }

  if (dayjs(dateTimeScheduled).hour() < 8) {
    const error: ErrorMessage = { message: "Schedule is too early" };
    res.status(400).json(error);
    return;
  }

  if (dayjs(dateTimeFinished).hour() > 18) {
    const error: ErrorMessage = { message: "Schedule is too late" };
    res.status(400).json(error);
    return;
  }

  const appointment = new Appointment({
    dentist: dentistSelected._id,
    patient: patientSelected._id,
    service,
    dateTimeScheduled,
    dateTimeFinished,
  });

  await addLog(req.session.uid!, LogModule[1], LogType[0], appointment);

  await appointment.save();
  res.status(201).json(appointment);
};

export const getDentistAppointments: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  const paramsSchema = z
    .object({
      dentist: z.string({ required_error: "User ID is required" }),
    })
    .refine(({ dentist }) => isValidObjectId(dentist), {
      message: "Invalid user ID",
    });

  const paramsParse = paramsSchema.safeParse(req.params);

  if (!paramsParse.success) {
    res.status(400).send(paramsParse.error.flatten());
    return;
  }

  const querySchema = z.object({
    date: z.coerce.date().optional(),
  });

  const queryParse = querySchema.safeParse(req.query);

  if (!queryParse.success) {
    res.status(400).send(queryParse.error.flatten());
    return;
  }

  const { dentist } = req.params as z.infer<typeof paramsSchema>;
  const { date } = req.query;

  const existingStaff = await Staff.findOne({ user: dentist });

  if (!existingStaff) {
    res.status(400).send({ message: "Dentist doesn't exist" });
    return;
  }

  const dentistSelected = await Dentist.findOne({ staff: existingStaff._id });

  if (!dentistSelected) {
    res.status(400).send({ message: "Dentist doesn't exist" });
    return;
  }

  const appointments = await Appointment.find({
    dentist: dentistSelected._id,
    ...(date && {
      dateTimeScheduled: {
        $gte: dayjs(date.toString()),
        $lt: dayjs(date.toString()).format("YYYY-MM-DDT23:59:59"),
      },
    }),
    dateTimeFinished: {
      $gt: dayjs(),
    },
  })
    .populate({
      path: "dentist",
      populate: {
        path: "staff",
        populate: {
          path: "user",
        },
      },
    })
    .populate({
      path: "patient",
      populate: {
        path: "user",
      },
    })
    .populate({ path: "service" });

  res.status(200).json(appointments);
};

export const getPatientAppointments: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  const paramsSchema = z
    .object({
      patient: z.string({ required_error: "User ID is required" }),
    })
    .refine(({ patient }) => isValidObjectId(patient), {
      message: "Invalid user ID",
    });

  const paramsParse = paramsSchema.safeParse(req.params);

  if (!paramsParse.success) {
    res.status(400).send(paramsParse.error.flatten());
    return;
  }

  const querySchema = z.object({
    date: z.coerce.date().optional(),
  });

  const queryParse = querySchema.safeParse(req.query);

  if (!queryParse.success) {
    res.status(400).send(queryParse.error.flatten());
    return;
  }

  const { patient } = req.params as z.infer<typeof paramsSchema>;
  const { date } = req.query;

  const patientSelected = await Patient.findOne({ user: patient });

  if (!patientSelected) {
    res.status(400).send({ message: "Patient does not exist" });
    return;
  }

  const appointments = await Appointment.find({
    patient: patientSelected._id,
    ...(date && {
      dateTimeScheduled: {
        $gte: dayjs(date.toString()),
        $lt: dayjs(date.toString()).format("YYYY-MM-DDT23:59:59"),
      },
    }),
    dateTimeFinished: {
      $gt: dayjs(),
    },
  })
    .populate({
      path: "dentist",
      populate: {
        path: "staff",
        populate: {
          path: "user",
        },
      },
    })
    .populate({
      path: "patient",
      populate: {
        path: "user",
      },
    })
    .populate({ path: "service" });

  res.status(200).json(appointments);
};

export const editAppointment: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  const appointmentSchema = z.object({
    dentist: z.string({ required_error: "Dentist id is required" }),
    patient: z.string({ required_error: "Patient is required" }),
    service: z.string({ required_error: "Service is required" }),
    dateTimeScheduled: z.string({
      required_error: "Date and time scheduled is required",
    }),
    dateTimeFinished: z.string({
      required_error: "Date and time finished is required",
    }),
  });

  type body = z.infer<typeof appointmentSchema>;

  const parse = appointmentSchema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).json(parse.error.flatten());
    return;
  }

  const { dentist, patient, service, dateTimeScheduled, dateTimeFinished }: body = req.body;

  const { appointmentId } = req.params;

  if (!isValidObjectId(appointmentId)) {
    const error: ErrorMessage = { message: "Invalid appointment ID" };
    res.status(400).json(error);
    return;
  }

  if (!isValidObjectId(dentist)) {
    const error: ErrorMessage = { message: "Invalid dentist ID" };
    res.status(400).json(error);
    return;
  }

  if (!isValidObjectId(patient)) {
    const error: ErrorMessage = { message: "Invalid patient ID" };
    res.status(400).json(error);
    return;
  }

  if (!isValidObjectId(service)) {
    const error: ErrorMessage = { message: "Invalid service ID" };
    res.status(400).json(error);
    return;
  }

  if (token.role === Roles.Patient && req.session.uid !== patient) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const dentistSelected = await Dentist.findById(dentist);
  const serviceSelected = await Service.findById(service);

  if (!dentistSelected) {
    const error: ErrorMessage = { message: "Dentist doesn't exist" };
    res.status(400).json(error);
    return;
  }

  if (!serviceSelected) {
    const error: ErrorMessage = { message: "Service doesn't exist" };
    res.status(400).json(error);
    return;
  }

  const patientAppointmentDates = await Appointment.find({ patient }).select(
    "dateTimeScheduled dateTimeFinished"
  );
  const dentistAppointmentDates = await Appointment.find({ dentist }).select(
    "dateTimeScheduled dateTimeFinished"
  );

  const allAppointments = patientAppointmentDates
    .concat(dentistAppointmentDates)
    .filter(
      (appointment, index, arr) => index === arr.findIndex((t) => t._id.equals(appointment._id))
    );

  if (allAppointments && allAppointments.length > 0)
    for (let i = 0; i < allAppointments.length; i++) {
      const timeStart = dayjs(dateTimeScheduled);
      const timeEnd = dayjs(dateTimeFinished);

      const appointment = allAppointments[i];
      const appointmentTimeStart = appointment && dayjs(appointment.dateTimeScheduled);
      const appointmentTimeEnd = appointment && dayjs(appointment.dateTimeFinished);

      if (
        timeStart.isBetween(appointmentTimeStart, appointmentTimeEnd, "minute", "[)") ||
        timeEnd.isBetween(appointmentTimeStart, appointmentTimeEnd, "minute", "(]") ||
        (timeStart.isBefore(appointmentTimeStart, "minute") &&
          timeEnd.isAfter(appointmentTimeEnd, "minute"))
      ) {
        const error: ErrorMessage = { message: "Schedule is not available" };
        res.status(400).json(error);
        return;
      }
    }

  if (dayjs(dateTimeScheduled).hour() < 8) {
    const error: ErrorMessage = { message: "Schedule is too early" };
    res.status(400).json(error);
    return;
  }

  if (dayjs(dateTimeFinished).hour() > 18) {
    const error: ErrorMessage = { message: "Schedule is too late" };
    res.status(400).json(error);
    return;
  }

  const editedAppointment = await Appointment.findByIdAndUpdate(appointmentId, {
    dentist,
    patient,
    service,
    dateTimeScheduled,
    dateTimeFinished,
  });

  if (!editedAppointment) {
    const error: ErrorMessage = { message: "Appointment doesn't exist" };
    res.status(400).json(error);
    return;
  }

  await addLog(req.session.uid!, LogModule[1], LogType[1], editedAppointment);

  res.status(200).json({
    _id: editedAppointment._id,
    message: "Successfully edited the appointment",
  });
};

export const removeAppointment: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  const { appointmentId } = req.params;

  if (!isValidObjectId(appointmentId)) {
    const error: ErrorMessage = { message: "Invalid appointment ID" };
    res.status(400).json(error);
    return;
  }

  const appointmentToDelete = await Appointment.findById(appointmentId).populate({
    path: "patient",
    populate: {
      path: "user",
    },
  });

  if (!appointmentToDelete) {
    const error: ErrorMessage = { message: "Appointment doesn't exist" };
    res.status(400).json(error);
    return;
  }

  if (dayjs(appointmentToDelete.dateTimeFinished).isBefore(dayjs())) {
    const error: ErrorMessage = {
      message: "Can't remove an appointment that is already finished",
    };
    res.status(400).json(error);
    return;
  }

  if (
    token.role === Roles.Patient &&
    (appointmentToDelete.patient as unknown as { user: User }).user._id.toString() !==
      req.session.uid
  ) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  if (
    token.role === Roles.Patient &&
    !dayjs().add(2, "day").isSameOrBefore(dayjs(appointmentToDelete.dateTimeScheduled))
  ) {
    const error: ErrorMessage = {
      message: "Cancelling should be at least two days in advance.",
    };
    res.status(400).json(error);
    return;
  }

  const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

  if (!deletedAppointment) {
    const error: ErrorMessage = { message: "Appointment doesn't exist" };
    res.status(400).json(error);
    return;
  }

  await addLog(req.session.uid!, LogModule[1], LogType[2], deletedAppointment);

  res.status(200).json({
    _id: deletedAppointment._id,
    message: "Succesfully deleted the appointment",
  });
};
