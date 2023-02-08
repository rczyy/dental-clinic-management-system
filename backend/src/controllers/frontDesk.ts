import { RequestHandler } from "express";
import { Roles } from "../constants";
import { verifyToken } from "../utilities/verifyToken";
import FrontDesk from "../models/frontDesk";

export const getFrontDesks: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    res.status(401).json({ message: token.message });
    return;
  }

  if (token.role !== Roles.Admin && token.role !== Roles.Manager) {
    res.status(401).json({ message: "Unauthorized to do this" });
    return;
  }

  const frontDesks = await FrontDesk.find();

  res.status(200).json(frontDesks);
};
