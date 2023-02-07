import { RequestHandler } from "express";
import Dentist from "../models/dentist";

export const getDentists: RequestHandler = async (_, res) => {
  const dentists = await Dentist.find();

  res.status(200).json(dentists);
};
