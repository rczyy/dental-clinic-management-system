import { RequestHandler } from "express";
import FrontDesk from "../models/frontDesk";

export const getFrontDesks: RequestHandler = async (_, res) => {
  const frontDesks = await FrontDesk.find();

  res.status(200).json(frontDesks);
};
