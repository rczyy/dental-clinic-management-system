import { RequestHandler } from "express";
import Assistant from "../models/assistant";

export const getAssistants: RequestHandler = async (_, res) => {
  const assistants = await Assistant.find();

  res.status(200).json(assistants);
};
