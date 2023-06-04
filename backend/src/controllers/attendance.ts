import { RequestHandler } from "express";
import { verifyToken } from "../utilities/verifyToken";
import { Roles } from "../constants";
import Attendance from "../models/attendance";
import { z } from "zod";
import Staff from "../models/staff";
import { isValidObjectId } from "mongoose";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export const getAttendance: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (
    token.role !== Roles.Admin &&
    token.role !== Roles.Manager &&
    token.role !== Roles.FrontDesk
  ) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const attendance = await Attendance.find().populate({
    path: "staff",
    populate: { path: "user" },
  });
  res.status(201).json(attendance);
};

export const getAttendanceToday: RequestHandler = async (req, res) => {
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
  const dateToday = dayjs().startOf("D").format("YYYY-MM-DD");
  const attendanceToday = await Attendance.find({
    date: dateToday,
  }).populate({
    path: "staff",
    populate: { path: "user" },
  });
  res.status(201).json(attendanceToday);
};

export const getMyAttendance: RequestHandler = async (req, res) => {
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

  const existingStaff = await Staff.findOne({ user: req.session.uid });

  if (!existingStaff) {
    const error: ErrorMessage = { message: "Staff does not exist" };
    res.status(401).json(error);
    return;
  }

  const myAttendance = await Attendance.find({ staff: existingStaff._id });
  res.status(201).json(myAttendance);
};

export const editAttendance: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (
    token.role !== Roles.Admin &&
    token.role !== Roles.Manager &&
    token.role !== Roles.FrontDesk
  ) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const dateSchema = z.object({
    timeIn: z
      .string({ required_error: "Time In is required" })
      .min(1, "Time In cannot be empty")
      .regex(
        /((1[0-2]|0?[1-9]):([0-5][0-9]):([0-5][0-9]) ?([AaPp][Mm]))/,
        "Invalid Time"
      ),
    timeOut: z
      .string()
      .regex(
        /((1[0-2]|0?[1-9]):([0-5][0-9]):([0-5][0-9]) ?([AaPp][Mm]))/,
        "Invalid Time"
      )
      .optional(),
  });

  type body = z.infer<typeof dateSchema>;

  const parse = dateSchema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).json(parse.error.flatten());
    return;
  }

  const { attendanceID } = req.params;

  if (!isValidObjectId(attendanceID)) {
    const error: ErrorMessage = { message: "Invalid attendance ID" };
    res.status(400).json(error);
    return;
  }

  const { timeIn, timeOut }: body = req.body;

  if (timeOut && timeIn > timeOut) {
    const error: FormError = {
      formErrors: ["Time Out must be later than Time In"],
    };

    res.status(401).json(error);
    return;
  }
  const selectedAttendance = await Attendance.findById(attendanceID);

  if (!selectedAttendance) {
    const error: ErrorMessage = { message: "Attendance doesn't exist" };
    res.status(400).json(error);
    return;
  }
  const formattedDate = dayjs(selectedAttendance.date).format("YYYY-MM-DD");

  const editedAttendance = await Attendance.findByIdAndUpdate(
    attendanceID,
    {
      timeIn: dayjs(`${formattedDate}T${timeIn}`, "YYYY-MM-DDTh:mm:ss A"),
      timeOut:
        (timeOut &&
          dayjs(`${formattedDate}T${timeOut}`, "YYYY-MM-DDTh:mm:ss A")) ||
        null,
    },
    { new: true }
  );

  res.status(201).json(editedAttendance);
};

export const removeAttendance: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (
    token.role !== Roles.Admin &&
    token.role !== Roles.Manager &&
    token.role !== Roles.FrontDesk
  ) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const { attendanceID } = req.params;

  if (!isValidObjectId(attendanceID)) {
    const error: ErrorMessage = { message: "Invalid attendance ID" };
    res.status(400).json(error);
    return;
  }

  const deletedAttendance = await Attendance.findByIdAndDelete(attendanceID);

  if (!deletedAttendance) {
    const error: ErrorMessage = { message: "Attendance doesn't exist" };
    res.status(400).json(error);
    return;
  }

  res.status(200).json({
    _id: deletedAttendance._id,
    message: "Successfully deleted the attendance",
  });
};

export const logTimeIn: RequestHandler = async (req, res) => {
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

  const timeIn = dayjs().format();
  const dateToday = dayjs().startOf("D").format("YYYY-MM-DD");

  const existingStaff = await Staff.findOne({ user: req.session.uid });

  if (!existingStaff) {
    const error: ErrorMessage = { message: "Staff does not exist" };
    res.status(401).json(error);
    return;
  }

  const existingLog = await Attendance.findOne({
    date: dateToday,
    staff: existingStaff._id,
  });

  if (existingLog && existingLog.timeIn) {
    const error: ErrorMessage = { message: "Already timed in" };
    res.status(401).json(error);
    return;
  }
  const attendance = new Attendance({
    timeIn,
    timeOut: null,
    date: dateToday,
    staff: existingStaff._id,
  });

  await attendance.save();
  res.status(201).json(attendance);
};

export const logTimeOut: RequestHandler = async (req, res) => {
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

  const timeOut = dayjs().format();
  const dateToday = dayjs().format("YYYY-MM-DD");

  const existingStaff = await Staff.findOne({ user: req.session.uid });

  if (!existingStaff) {
    const error: ErrorMessage = { message: "Staff does not exist" };
    res.status(401).json(error);
    return;
  }

  const existingLog = await Attendance.findOne({
    date: dateToday,
    staff: existingStaff._id,
  });

  if (!existingLog || (existingLog && !existingLog.timeIn)) {
    const error: ErrorMessage = { message: "Not timed in yet" };
    res.status(401).json(error);
    return;
  }

  if (existingLog && existingLog.timeOut) {
    const error: ErrorMessage = { message: "Already timed out" };
    res.status(401).json(error);
    return;
  }

  const formattedTimeIn = dayjs(existingLog.timeIn).format("h:mm:ss A");
  const formattedTimeOut = dayjs(timeOut).format("h:mm:ss A");

  if (formattedTimeIn > formattedTimeOut) {
    const error: ErrorMessage = {
      message: "Time Out must be later than Time In",
    };
    res.status(400).json(error);
    return;
  }

  const attendance = await Attendance.findOneAndUpdate(
    { date: dateToday, staff: existingStaff._id },
    { timeOut },
    { new: true }
  );

  res.status(201).json(attendance);
};
