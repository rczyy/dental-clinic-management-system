import { RequestHandler } from "express";
import { Roles } from "../constants";
import { verifyToken } from "../utilities/verifyToken";
import Dentist from "../models/dentist";

export const getDentists: RequestHandler = async (req, res) => {
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

  const dentists = await Dentist.find();

  res.status(200).json(dentists);
};

export const getDentistNames: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (
    token.role !== Roles.Admin &&
    token.role !== Roles.Manager &&
    token.role !== Roles.Dentist &&
    token.role !== Roles.Assistant &&
    token.role !== Roles.FrontDesk &&
    token.role !== Roles.Patient
  ) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const dentists = await Dentist.find().populate({
    path: "staff",
    populate: { path: "user", select: "name" },
  });

  const response = dentists.map((dentist) => {
    const { user } = dentist.staff as unknown as { user: Pick<User, "_id" | "name"> };
    const { _id, name } = user

    return {
      _id,
      name,
    }
  });

  res.status(200).json(response);
};
