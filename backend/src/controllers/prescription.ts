import { RequestHandler } from "express";
import { verifyToken } from "../utilities/verifyToken";
import { Roles } from "../constants";
import { z } from "zod";
import { Types, isValidObjectId } from "mongoose";
import Patient from "../models/patient";
import Prescription from "../models/prescription";

export const getPrescriptions: RequestHandler = async (req, res) => {
  const params = z
    .object({
      userId: z.string({ required_error: "User ID is required" }),
    })
    .refine(({ userId }) => isValidObjectId(userId), {
      message: "Invalid user ID",
    });

  const parse = params.safeParse(req.params);

  if (!parse.success) {
    res.status(400).send(parse.error.flatten());
    return;
  }

  const { userId } = req.params as z.infer<typeof params>;

  const patient = await Patient.findOne({ user: userId });

  if (!patient || patient.isDeleted) {
    res.status(400).send({ message: "Patient does not exist" });
    return;
  }

  const prescriptions = await Prescription.find({
    patient: patient._id,
  }).populate({
    path: "prescriber",
    populate: {
      path: "staff",
      populate: {
        path: "user",
      },
    },
  });

  res.status(200).send(prescriptions);
};

export const addPrescription: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role !== Roles.Admin && token.role !== Roles.Dentist) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const params = z
    .object({
      userId: z.string({ required_error: "User ID is required" }),
    })
    .refine(({ userId }) => isValidObjectId(userId), {
      message: "Invalid user ID",
    });

  const paramsParse = params.safeParse(req.params);

  if (!paramsParse.success) {
    res.status(400).send(paramsParse.error.flatten());
    return;
  }

  const body = z.object({
    name: z
      .string({ required_error: "Prescription name is required" })
      .min(1, "Prescription name cannot be empty"),
    dose: z
      .string({ required_error: "Dose is required" })
      .min(1, "Dose cannot be empty"),
    frequency: z
      .string({ required_error: "Frequency is required" })
      .min(1, "Frequency cannot be empty"),
  });

  const bodyParse = body.safeParse(req.body);

  if (!bodyParse.success) {
    res.status(400).send(bodyParse.error.flatten());
    return;
  }

  const { userId } = req.params as z.infer<typeof params>;
  const { name, dose, frequency } = req.body as z.infer<typeof body>;

  const patient = await Patient.findOne({ user: userId });

  if (!patient || patient.isDeleted) {
    res.status(400).send({ message: "Patient does not exist" });
    return;
  }

  const newPrescription = new Prescription();

  newPrescription.patient = patient._id;
  newPrescription.prescriber = req.session.uid as unknown as Types.ObjectId;
  newPrescription.name = name;
  newPrescription.dose = dose;
  newPrescription.frequency = frequency;

  await newPrescription.save().catch((e) => res.status(400).send(e));

  res.status(201).send(newPrescription);
};

export const editPrescription: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role !== Roles.Admin && token.role !== Roles.Dentist) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const params = z
    .object({
      id: z.string({ required_error: "Prescription ID is required" }),
    })
    .refine(({ id }) => isValidObjectId(id), {
      message: "Invalid prescription ID",
    });

  const paramsParse = params.safeParse(req.params);

  if (!paramsParse.success) {
    res.status(400).send(paramsParse.error.flatten());
    return;
  }

  const body = z.object({
    name: z
      .string({ required_error: "Prescription name is required" })
      .min(1, "Prescription name cannot be empty")
      .optional(),
    dose: z
      .string({ required_error: "Dose is required" })
      .min(1, "Dose cannot be empty")
      .optional(),
    frequency: z
      .string({ required_error: "Frequency is required" })
      .min(1, "Frequency cannot be empty")
      .optional(),
  });

  const bodyParse = body.safeParse(req.body);

  if (!bodyParse.success) {
    res.status(400).send(bodyParse.error.flatten());
    return;
  }

  const { id } = req.params as z.infer<typeof params>;
  const { name, dose, frequency } = req.body as z.infer<typeof body>;

  const existingPrescription = await Prescription.findById(id);

  if (!existingPrescription) {
    res.status(400).send({ message: "Prescription does not exist" });
    return;
  }

  if (name) existingPrescription.name = name;
  if (dose) existingPrescription.dose = dose;
  if (frequency) existingPrescription.frequency = frequency;

  await existingPrescription.save().catch((e) => res.status(400).send(e));

  res.status(200).send(existingPrescription);
};

export const removePrescription: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role !== Roles.Admin && token.role !== Roles.Dentist) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const params = z
    .object({
      id: z.string({ required_error: "ID is required" }),
    })
    .refine(({ id }) => isValidObjectId(id), {
      message: "Invalid ID",
    });

  const parse = params.safeParse(req.params);

  if (!parse.success) {
    res.status(400).send(parse.error.flatten());
    return;
  }

  const { id } = req.params as z.infer<typeof params>;

  const deletedPrescription = await Prescription.findByIdAndDelete(id);

  if (!deletedPrescription) {
    res.status(400).send({ message: "Prescription does not exist" });
    return;
  }

  res.status(200).send({
    message: "Prescription succesfully deleted",
    id: deletedPrescription._id,
  });
};
