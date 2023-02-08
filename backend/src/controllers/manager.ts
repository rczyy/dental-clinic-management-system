import { RequestHandler } from "express";
import { Roles } from "../constants";
import { verifyToken } from "../utilities/verifyToken";
import Manager from "../models/manager";

export const getManagers: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    res.status(401).json({ message: token.message });
    return;
  }

  if (token.role !== Roles.Admin && token.role !== Roles.Manager) {
    res.status(401).json({ message: "Unauthorized to do this" });
    return;
  }

  const managers = await Manager.find();

  res.status(200).json(managers);
};
