import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import DentistSchedule from "../models/dentistSchedule";
import Staff from "../models/staff";
import Dentist from "../models/dentist";

export const getDentistSchedule: RequestHandler = async (req, res) => {
  const paramsSchema = z
    .object({
      dentist: z.string({ required_error: "ID is required" }),
    })
    .refine(({ dentist }) => isValidObjectId(dentist), {
      message: "Invalid ID",
    });

  const paramsParse = paramsSchema.safeParse(req.params);

  if (!paramsParse.success) {
    res.status(400).send(paramsParse.error.flatten());
    return;
  }

  const { dentist } = req.params as z.infer<typeof paramsSchema>;

  const schedules = await DentistSchedule.find({ dentist });

  res.status(200).send(schedules);
};

export const addDentistSchedule: RequestHandler = async (req, res) => {
  const bodySchema = z.object({
    date: z.coerce.date({ required_error: "Date is required" }),
  });

  const bodyParse = bodySchema.safeParse(req.body);

  if (!bodyParse.success) {
    res.status(400).send(bodyParse.error.flatten());
    return;
  }

  const { date } = req.body as z.infer<typeof bodySchema>;

  const existingStaff = await Staff.findOne({ user: req.session.uid });

  if (!existingStaff) {
    res.status(400).send({ message: "Unauthorize to add a schedule" });
    return;
  }

  const existingDentist = await Dentist.findOne({ staff: existingStaff._id });

  if (!existingDentist) {
    res.status(400).send({ message: "Unauthorize to add a schedule" });
    return;
  }

  const newSchedule = await DentistSchedule.create({
    dentist: existingDentist._id,
    date,
  });

  res.status(200).send(newSchedule);
};

export const deleteDentistSchedule: RequestHandler = async (req, res) => {
  const bodySchema = z.object({
    date: z.coerce.date({ required_error: "Date is required" }),
  });

  const bodyParse = bodySchema.safeParse(req.body);

  if (!bodyParse.success) {
    res.status(400).send(bodyParse.error.flatten());
    return;
  }

  const { date } = req.body as z.infer<typeof bodySchema>;

  const existingStaff = await Staff.findOne({ user: req.session.uid });

  if (!existingStaff) {
    res.status(400).send({ message: "Unauthorize to add a schedule" });
    return;
  }

  const existingDentist = await Dentist.findOne({ staff: existingStaff._id });

  if (!existingDentist) {
    res.status(400).send({ message: "Unauthorize to add a schedule" });
    return;
  }

  const removedSchedule = await DentistSchedule.findOneAndRemove({
    dentist: existingDentist._id,
    date,
  });

  res.status(200).send(removedSchedule);
};
