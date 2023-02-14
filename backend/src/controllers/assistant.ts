import { RequestHandler } from "express";
import { Roles } from "../constants";
import { verifyToken } from "../utilities/verifyToken";
import Assistant from "../models/assistant";

export const getAssistants: RequestHandler = async (req, res) => {
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

  const assistants = await Assistant.find();

  res.status(200).json(assistants);
};
