import { RequestHandler } from "express";
import { verifyToken } from "../utilities/verifyToken";
import { Roles } from "../constants";
import Attendance from "../models/attendance";
import { z } from "zod";
import Staff from "../models/staff";
import { isValidObjectId } from "mongoose";

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
    const error: FormError = {
      formErrors: ["Staff does not exist"],
    };

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
    timeIn: z.string({ required_error: "Date and Time is required" }),
    timeOut: z.string({ required_error: "Date and Time is required" }),
  });

  type body = z.infer<typeof dateSchema>;

  const parse = dateSchema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).json(parse.error.flatten());
    return;
  }

  const { timeIn, timeOut }: body = req.body;

  const { attendanceID } = req.params;

  if (!isValidObjectId(attendanceID)) {
    const error: ErrorMessage = { message: "Invalid service ID" };
    res.status(400).json(error);
    return;
  }

  const editedAttendance = await Attendance.findByIdAndUpdate(attendanceID, {
    timeIn,
    timeOut,
  });

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
    token.role !== Roles.Dentist &&
    token.role !== Roles.Assistant &&
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

  const dateSchema = z.object({
    timeIn: z.string({ required_error: "Date and Time is required" }),
  });

  type body = z.infer<typeof dateSchema>;

  const parse = dateSchema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).json(parse.error.flatten());
    return;
  }

  const { timeIn }: body = req.body;

  const dateToday = new Date();
  dateToday.setHours(0, 0, 0, 0);

  const existingStaff = await Staff.findOne({ user: req.session.uid });

  if (!existingStaff) {
    const error: FormError = {
      formErrors: ["Staff does not exist"],
    };

    res.status(401).json(error);
    return;
  }

  const existingLog = await Attendance.findOne({
    date: dateToday,
    staff: existingStaff._id,
  });

  if (existingLog && existingLog.timeIn) {
    const error: FormError = {
      formErrors: ["Already timed in"],
    };

    res.status(401).json(error);
    return;
  }
  const attendance = new Attendance({
    timeIn,
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

  const dateSchema = z.object({
    timeOut: z.string({ required_error: "Date and Time is required" }),
  });

  type body = z.infer<typeof dateSchema>;

  const parse = dateSchema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).json(parse.error.flatten());
    return;
  }

  const { timeOut }: body = req.body;

  const dateToday = new Date();
  dateToday.setHours(0, 0, 0, 0);

  const existingStaff = await Staff.findOne({ user: req.session.uid });

  if (!existingStaff) {
    const error: FormError = {
      formErrors: ["Staff does not exist"],
    };

    res.status(401).json(error);
    return;
  }

  const existingLog = await Attendance.findOne({
    date: dateToday,
    staff: existingStaff._id,
  });

  if (existingLog && !existingLog.timeIn) {
    const error: FormError = {
      formErrors: ["Not timed in yet"],
    };

    res.status(401).json(error);
    return;
  }

  if (existingLog && existingLog.timeOut) {
    const error: FormError = {
      formErrors: ["Already timed out"],
    };

    res.status(401).json(error);
    return;
  }

  const attendance = await Attendance.findOneAndUpdate(
    { date: dateToday, staff: existingStaff._id },
    {
      timeOut,
    },
    { new: true }
  );

  res.status(201).json(attendance);
};
