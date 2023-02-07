import { RequestHandler } from "express";
import Manager from "../models/manager";

export const getManagers: RequestHandler = async (_, res) => {
  const managers = await Manager.find();

  res.status(200).json(managers);
};
