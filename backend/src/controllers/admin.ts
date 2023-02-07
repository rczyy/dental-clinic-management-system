import { RequestHandler } from "express";
import Admin from "../models/admin";

export const getAdmins: RequestHandler = async (_, res) => {
  const admins = await Admin.find();

  res.status(200).json(admins);
};
