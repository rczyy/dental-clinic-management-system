import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import DentistSchedule from "../models/dentistSchedule";
import Staff from "../models/staff";
import Dentist from "../models/dentist";
import { addLog } from "../utilities/addLog";
import { LogModule, LogType } from "../constants";

export const getDentistSchedule: RequestHandler = async (req, res) => {
  const querySchema = z
    .object({
      dentist: z.string({ required_error: "ID is required" }).optional()
    })
    .refine(({ dentist }) => (dentist ? isValidObjectId(dentist) : true), {
      message: "Invalid User ID"
    });

  const queryParse = querySchema.safeParse(req.query);

  if (!queryParse.success) {
    res.status(400).send(queryParse.error.flatten());
    return;
  }

  const { dentist } = req.query as z.infer<typeof querySchema>;

  if (dentist) {
    const existingStaff = await Staff.findOne({ user: dentist });

    if (!existingStaff) {
      res.status(400).send({ message: "Dentist does not exist" });
      return;
    }

    const existingDentist = await Dentist.findOne({ staff: existingStaff._id });

    if (!existingDentist) {
      res.status(400).send({ message: "Dentist does not exist" });
      return;
    }

    const schedules = await DentistSchedule.find({
      dentist: existingDentist._id
    }).populate({
      path: "dentist",
      populate: { path: "staff", populate: { path: "user" } }
    });

    res.status(200).send(schedules);
    return;
  }

  const schedules = await DentistSchedule.find().populate({
    path: "dentist",
    populate: { path: "staff", populate: { path: "user" } }
  });

  res.status(200).send(schedules);
};

export const editDentistSchedule: RequestHandler = async (req, res) => {
  const bodySchema = z.object({
    dates: z.coerce.date({ required_error: "Date is required" }).array()
  });

  const bodyParse = bodySchema.safeParse(req.body);

  if (!bodyParse.success) {
    res.status(400).send(bodyParse.error.flatten());
    return;
  }

  const { dates } = req.body as z.infer<typeof bodySchema>;

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

  await DentistSchedule.deleteMany({ dentist: existingDentist._id });

  const newSchedules = await Promise.all(
    dates.map(async (date) => {
      return await DentistSchedule.create({
        dentist: existingDentist._id,
        date
      });
    })
  );

  if (!newSchedules[0]) {
    res.status(400).send({ message: "No dentist schedule" });
    return;
  }

  await addLog(
    req.session.uid!,
    LogModule[2],
    LogType[1],
    newSchedules[0].dentist,
    "Dentist"
  );

  res.status(200).send(newSchedules);
};
