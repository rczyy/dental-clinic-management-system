import { RequestHandler } from "express";
import { verifyToken } from "../utilities/verifyToken";
import { Roles } from "../constants";
import Bill from "../models/bill";
import Appointment from "../models/appointment";
import { z } from "zod";
import { isValidObjectId } from "mongoose";
import dayjs from "dayjs";

export const getBills: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role === Roles.Assistant || token.role === Roles.Patient) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
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

  const { date } = req.query;

  const bills = await Bill.find({
    ...(date && {
      createdAt: {
        $gte: dayjs(date.toString()),
        $lt: dayjs(date.toString()).format("YYYY-MM-DDT23:59:59"),
      },
    }),
    isDeleted: false,
  })
    .populate({
      path: "appointment",
      populate: {
        path: "dentist",
        populate: {
          path: "staff",
          populate: {
            path: "user",
          },
        },
      },
    })
    .populate({
      path: "appointment",
      populate: {
        path: "patient",
        populate: {
          path: "user",
        },
      },
    })
    .populate({
      path: "appointment",
      populate: {
        path: "service",
      },
    });

  res.status(200).send(bills);
};

export const getDeletedBills: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role !== Roles.Admin && token.role !== Roles.Manager) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
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

  const { date } = req.query;

  const bills = await Bill.find({
    ...(date && {
      createdAt: {
        $gte: dayjs(date.toString()),
        $lt: dayjs(date.toString()).format("YYYY-MM-DDT23:59:59"),
      },
    }),
    isDeleted: true,
  });

  res.status(200).send(bills);
};

export const addBill: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role === Roles.Assistant || token.role === Roles.Patient) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const schema = z
    .object({
      appointment: z.string({ required_error: "Appointment is required" }),
      notes: z.string().optional(),
      price: z.coerce
        .number({ required_error: "Price is required" })
        .positive("Price must be a positive number")
        .finite("Infinite price are not allowed"),
    })
    .refine(({ appointment }) => isValidObjectId(appointment), {
      message: "Appointment is invalid",
    });

  const parse = schema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).send(parse.error.flatten());
    return;
  }

  const { appointment, notes, price } = req.body as z.infer<typeof schema>;

  const existingAppointment = await Appointment.findById(appointment);

  if (!existingAppointment) {
    res.status(400).send({ message: "Appointment does not exist" });
    return;
  }

  if (existingAppointment.isFinished) {
    res.status(400).send({ message: "Appointment is already finished" });
    return;
  }

  if (dayjs().isBefore(dayjs(existingAppointment.dateTimeScheduled))) {
    const error: ErrorMessage = {
      message: "Can't end an appointment that hasn't been started",
    };
    res.status(400).json(error);
    return;
  }

  existingAppointment.dateTimeFinished = new Date();
  existingAppointment.isFinished = true;

  await existingAppointment.save().catch((err) => {
    throw new Error(err);
  });

  const newBill = await Bill.create({
    appointment,
    notes,
    price,
  });

  res.status(200).send(newBill);
};

export const editBill: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role === Roles.Assistant || token.role === Roles.Patient) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  res.status(200).send("OK");
};

export const removeBill: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role === Roles.Assistant || token.role === Roles.Patient) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  res.status(200).send("OK");
};
