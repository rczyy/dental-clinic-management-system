import { RequestHandler } from "express";
import { verifyToken } from "../utilities/verifyToken";
import { z } from "zod";
import { Roles } from "../constants";
import Appointment from "../models/appointments";
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

  const appointments = await Appointment.find();
  res.status(200).json(appointments);
};

export const addAppointment: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);
  console.log(req.body);
  
  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  const appointmentSchema = z.object({
    dentistId: z.string({ required_error: "Dentist id is required" }),
    patientId: z.string({ required_error: "Patient is required" }),
    serviceId: z.string({ required_error: "Service is required" }),
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
    dentistId,
    patientId,
    serviceId,
    dateTimeScheduled,
    dateTimeFinished,
  }: body = req.body;

  const patientAppointmentDates = await Appointment.find({ patientId }).select(
    "dateTimeScheduled dateTimeFinished"
  );
  const dentistAppointmentDates = await Appointment.find({ dentistId }).select(
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
    dentistId,
    patientId,
    serviceId,
    dateTimeScheduled,
    dateTimeFinished,
  });

  await appointment.save();
  res.status(201).json(appointment);
};
