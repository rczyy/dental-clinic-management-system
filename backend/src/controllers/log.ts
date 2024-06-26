import { verifyToken } from "../utilities/verifyToken";
import { Roles } from "../constants";
import { RequestHandler } from "express";
import Log from "../models/log";
import dayjs from "dayjs";

export const getLogs: RequestHandler = async (req, res) => {
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

  const { date } = req.query;

  const logs = await Log.find({
    ...(date && {
      date: {
        $gte: dayjs(date.toString()),
        $lt: dayjs(date.toString()).format("YYYY-MM-DDT23:59:59")
      }
    })
  }).populate({
    path: "user",
    select: "email role name"
  });

  res.status(200).json(logs.reverse());
};
