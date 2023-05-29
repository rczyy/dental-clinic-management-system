import { RequestHandler } from "express";
import { verifyToken } from "../utilities/verifyToken";
import { z } from "zod";
import { Roles } from "../constants";
import Appointment from "../models/appointment";
import Dentist from "../models/dentist";
import Service from "../models/service";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

export const getAppointments: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (
    token.role !== Roles.Admin &&
    token.role !== Roles.Manager &&
    token.role !== Roles.Dentist &&
    token.role !== Roles.Assistant &&
    token.role !== Roles.FrontDesk
  ) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const appointments = await Appointment.find().populate("service");
  res.status(200).json(appointments);
};

export const addAppointment: RequestHandler = async (req, res) => {
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

  const {
    dentist,
    patient,
    service,
    dateTimeScheduled,
    dateTimeFinished,
  }: body = req.body;

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
      (appointment, index, arr) =>
        index === arr.findIndex((t) => t._id.equals(appointment._id))
    );

  if (allAppointments && allAppointments.length > 0)
    for (let i = 0; i < allAppointments.length; i++) {
      const timeStart = dayjs(dateTimeScheduled);
      const timeEnd = dayjs(dateTimeFinished);

      const appointment = allAppointments[i];
      const appointmentTimeStart =
        appointment && dayjs(appointment.dateTimeScheduled);
      const appointmentTimeEnd =
        appointment && dayjs(appointment.dateTimeFinished);

      if (
        timeStart.isBetween(
          appointmentTimeStart,
          appointmentTimeEnd,
          "minute",
          "[)"
        ) ||
        timeEnd.isBetween(
          appointmentTimeStart,
          appointmentTimeEnd,
          "minute",
          "(]"
        ) ||
        (timeStart.isBefore(appointmentTimeStart, "minute") &&
          timeEnd.isAfter(appointmentTimeEnd, "minute"))
      ) {
        const error: ErrorMessage = { message: "Schedule is not available" };
        res.status(400).json(error);
        return;
      }
    }

  if (new Date(dateTimeScheduled).getHours() < 8) {
    const error: ErrorMessage = { message: "Schedule is too early" };
    res.status(400).json(error);
    return;
  }

  if (new Date(dateTimeFinished).getHours() > 6 + 12) {
    const error: ErrorMessage = { message: "Schedule is too late" };
    res.status(400).json(error);
    return;
  }

  const appointment = new Appointment({
    dentist,
    patient,
    service,
    dateTimeScheduled,
    dateTimeFinished,
  });

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

  const { dentist } = req.params;
  const { date } = req.query;

  if (!dentist) {
    const error: ErrorMessage = { message: "Invalid user ID" };
    res.status(400).json(error);
    return;
  }

  let appointments;

  if (date) {
    appointments = await Appointment.find({
      dentist,
      dateTimeScheduled: {
        $gte: dayjs(date.toString()),
        $lt: dayjs(date.toString()).format("YYYY-MM-DDT23:59:59"),
      },
    }).populate("service");
  } else {
    appointments = await Appointment.find({
      dentist,
    }).populate("service");
  }
  res.status(200).json(appointments);
};

export const getPatientAppointments: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  const { patient } = req.params;
  const { date } = req.query;

  if (!patient) {
    const error: ErrorMessage = { message: "Invalid user ID" };
    res.status(400).json(error);
    return;
  }

  let appointments;

  if (date) {
    appointments = await Appointment.find({
      patient,
      dateTimeScheduled: {
        $gte: dayjs(date.toString()),
        $lt: dayjs(date.toString()).format("YYYY-MM-DDT23:59:59"),
      },
    }).populate("service");
  } else {
    appointments = await Appointment.find({
      patient,
    }).populate("service");
  }

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

  const {
    dentist,
    patient,
    service,
    dateTimeScheduled,
    dateTimeFinished,
  }: body = req.body;

  const { appointmentId } = req.params;

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
      (appointment, index, arr) =>
        index === arr.findIndex((t) => t._id.equals(appointment._id))
    );

  if (allAppointments && allAppointments.length > 0)
    for (let i = 0; i < allAppointments.length; i++) {
      const timeStart = dayjs(dateTimeScheduled);
      const timeEnd = dayjs(dateTimeFinished);

      const appointment = allAppointments[i];
      const appointmentTimeStart =
        appointment && dayjs(appointment.dateTimeScheduled);
      const appointmentTimeEnd =
        appointment && dayjs(appointment.dateTimeFinished);

      if (
        timeStart.isBetween(
          appointmentTimeStart,
          appointmentTimeEnd,
          "minute",
          "[)"
        ) ||
        timeEnd.isBetween(
          appointmentTimeStart,
          appointmentTimeEnd,
          "minute",
          "(]"
        ) ||
        (timeStart.isBefore(appointmentTimeStart, "minute") &&
          timeEnd.isAfter(appointmentTimeEnd, "minute"))
      ) {
        const error: ErrorMessage = { message: "Schedule is not available" };
        res.status(400).json(error);
        return;
      }
    }

  if (new Date(dateTimeScheduled).getHours() < 8) {
    const error: ErrorMessage = { message: "Schedule is too early" };
    res.status(400).json(error);
    return;
  }

  if (new Date(dateTimeFinished).getHours() > 6 + 12) {
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

  res.status(200).json({
    _id: editedAppointment._id,
    message: "Successfully edited the Appointment",
  });
};