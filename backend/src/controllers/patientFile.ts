import { RequestHandler } from "express";
import { verifyToken } from "../utilities/verifyToken";
import { Roles } from "../constants";
import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PatientFile } from "../models/patientFile";
import Patient from "../models/patient";
import Bill from "../models/bill";

export const getPatientFiles: RequestHandler = async (req, res) => {
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

  const params = z
    .object({
      userId: z.string({ required_error: "User ID is required" }),
    })
    .refine(({ userId }) => isValidObjectId(userId), {
      message: "Invalid User ID",
    });

  const parse = params.safeParse(req.params);

  if (!parse.success) {
    res.status(400).send(parse.error.flatten());
    return;
  }

  const { userId } = req.params as z.infer<typeof params>;
  const { bill } = req.query;

  if (bill && !isValidObjectId(bill)) {
    res.status(400).send({ message: "Invalid bill ID" });
    return;
  }

  const patient = await Patient.findOne({ user: userId });

  if (!patient || patient.isDeleted) {
    res.status(400).send({ message: "Patient does not exist" });
    return;
  }

  const patientFiles = await PatientFile.find({
    patient: patient._id,
  });

  res.status(200).send(patientFiles);
};

export const addPatientFile: RequestHandler = async (req, res) => {
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

  const params = z
    .object({
      userId: z.string({ required_error: "User ID is required" }),
    })
    .refine(({ userId }) => isValidObjectId(userId), {
      message: "Invalid User ID",
    });

  const parse = params.safeParse(req.params);

  if (!parse.success) {
    res.status(400).send(parse.error.flatten());
    return;
  }

  const { userId } = req.params as z.infer<typeof params>;
  const { bill } = req.body;

  if (bill && !isValidObjectId(bill)) {
    res.status(400).send({ message: "Invalid bill ID" });
    return;
  }

  const patient = await Patient.findOne({ user: userId });

  if (!patient || patient.isDeleted) {
    res.status(400).send({ message: "Patient does not exist" });
    return;
  }

  if (bill) {
    const existingBill = await Bill.findById(bill);

    if (!existingBill) {
      res.status(400).send({ message: "Patient does not exist" });
      return;
    }
  }

  if (!req.files || req.files.length === 0) {
    res.status(400).send({ message: "File is required" });
    return;
  }

  res.status(200).send(req.files);
};

export const removePatientFile: RequestHandler = async (req, res) => {
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
