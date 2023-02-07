import { RequestHandler } from "express";
import User from "../models/user";

export const getUsers: RequestHandler = async (_, res) => {
  const users = await User.find();

  res.status(200).json(users);
};
