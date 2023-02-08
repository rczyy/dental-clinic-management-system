import { RequestHandler } from "express";
import { Roles } from "../constants";
import { verifyToken } from "../utilities/verifyToken";
import Assistant from "../models/assistant";

export const getAssistants: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    res.status(401).json({ message: token.message });
    return;
  }

  if (token.role !== Roles.Admin && token.role !== Roles.Manager) {
    res.status(401).json({ message: "Unauthorized to do this" });
    return;
  }

  const assistants = await Assistant.find();

  res.status(200).json(assistants);
};
