import { RequestHandler } from "express";
import { verifyToken } from "../utilities/verifyToken";
import { Roles } from "../constants";
import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PatientFile } from "../models/patientFile";
import Patient from "../models/patient";
import Bill from "../models/bill";
import { fileUpload } from "../utilities/fileUpload";

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
    ...(bill && { bill }),
  }).populate({ path: "bill", populate: { path: "appointment", populate: { path: "service" } } });

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
      res.status(400).send({ message: "Bill does not exist" });
      return;
    }
  }

  const { files } = req;

  if (!files || files.length === 0) {
    res.status(400).send({ message: "File is required" });
    return;
  }

  const patientFiles = await Promise.all(
    (files as Express.Multer.File[]).map(async (file) => {
      const patientFile = new PatientFile();

      patientFile.patient = patient._id;
      if (bill) patientFile.bill = bill;

      const folder = `patient-files/${patient._id}/`;

      try {
        const object = await fileUpload(folder, file);
        patientFile.name = file.originalname;
        patientFile.size = file.size;
        patientFile.file = object.Location;

        await patientFile.save();

        return patientFile;
      } catch (error) {
        const err = error as Error;

        res.status(400).send({ message: err.message });
        return;
      }
    })
  );

  res.status(200).send(patientFiles);
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

  const params = z
    .object({
      id: z.string({ required_error: "User ID is required" }),
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

  const removedPatientFile = await PatientFile.findByIdAndDelete(id);

  if (!removedPatientFile) {
    res.status(400).send({ message: "Patient file does not exist" });
    return;
  }

  res
    .status(200)
    .send({ message: "Successfully deleted patient file", id: removedPatientFile._id });
};
