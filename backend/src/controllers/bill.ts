import { RequestHandler } from "express";
import { verifyToken } from "../utilities/verifyToken";
import { Roles } from "../constants";
import Bill from "../models/bill";
import { z } from "zod";
import { isValidObjectId } from "mongoose";

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

  const bills = await Bill.find({ isDeleted: false });

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

  const bills = await Bill.find({ isDeleted: true });

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

  const { notes, price } = req.body as z.infer<typeof schema>;

  const newBill = await Bill.create({
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
