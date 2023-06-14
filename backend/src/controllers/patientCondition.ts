import { RequestHandler } from "express";
import { z } from "zod";
import { isValidObjectId } from "mongoose";
import Patient from "../models/patient";
import PatientCondition from "../models/patientCondition";
import { verifyToken } from "../utilities/verifyToken";
import { Roles } from "../constants";

export const getPatientConditions: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (!token.role) {
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

  const patient = await Patient.findOne({ user: userId });

  if (!patient || patient.isDeleted) {
    res.status(400).send({ message: "Patient does not exist" });
    return;
  }

  const patientConditions = await PatientCondition.find({
    patient: patient._id,
  });

  res.status(200).send(patientConditions);
};

export const addPatientCondition: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role === Roles.Patient) {
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

  const paramsParse = params.safeParse(req.params);

  if (!paramsParse.success) {
    res.status(400).send(paramsParse.error.flatten());
    return;
  }

  const body = z.object({
    condition: z
      .string({ required_error: "Condition is required" })
      .min(1, "Condition cannot be empty"),
    conditionType: z
      .string({ required_error: "Condition Type is required" })
      .min(1, "Condition Type cannot be empty"),
  });

  const bodyParse = body.safeParse(req.body);

  if (!bodyParse.success) {
    res.status(400).send(bodyParse.error.flatten());
    return;
  }

  const { userId } = req.params as z.infer<typeof params>;
  const { condition, conditionType } = req.body as z.infer<typeof body>;

  const patient = await Patient.findOne({ user: userId });

  if (!patient || patient.isDeleted) {
    res.status(400).send({ message: "Patient does not exist" });
    return;
  }

  const newPatientCondition = new PatientCondition();

  newPatientCondition.patient = patient._id;
  newPatientCondition.condition = condition;
  newPatientCondition.conditionType = conditionType;

  await newPatientCondition.save().catch((e) => res.status(400).send(e));

  res.status(201).send(newPatientCondition);
};

export const editPatientCondition: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role === Roles.Patient) {
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

  const paramsParse = params.safeParse(req.params);

  if (!paramsParse.success) {
    res.status(400).send(paramsParse.error.flatten());
    return;
  }

  const body = z.object({
    condition: z
      .string({ required_error: "Condition is required" })
      .min(1, "Condition cannot be empty")
      .optional(),
    conditionType: z
      .string({ required_error: "Condition Type is required" })
      .min(1, "Condition Type cannot be empty")
      .optional(),
  });

  const bodyParse = body.safeParse(req.body);

  if (!bodyParse.success) {
    res.status(400).send(bodyParse.error.flatten());
    return;
  }

  const { id } = req.params as z.infer<typeof params>;
  const { condition, conditionType } = req.body as z.infer<typeof body>;

  const existingPatientCondition = await PatientCondition.findById(id);

  if (!existingPatientCondition) {
    res.status(400).send({ message: "Patient condition does not exist" });
    return;
  }

  if (condition) existingPatientCondition.condition = condition;
  if (conditionType) existingPatientCondition.conditionType = conditionType;

  await existingPatientCondition.save().catch((e) => res.status(400).send(e));

  res.status(200).send(existingPatientCondition);
};

export const removePatientCondition: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role === Roles.Patient) {
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

  const deletedPatientCondition = await PatientCondition.findByIdAndDelete(id);

  if (!deletedPatientCondition) {
    res.status(400).send({ message: "Patient condition does not exist" });
    return;
  }

  res.status(200).send({
    message: "Patient condition succesfully deleted",
    id: deletedPatientCondition._id,
  });
};
