import { RequestHandler } from "express";
import Patient from "../models/patient";

export const getPatients: RequestHandler = async (_, res) => {
  const patients = await Patient.find();

  res.status(200).json(patients);
};
