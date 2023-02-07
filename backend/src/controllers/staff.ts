import { RequestHandler } from "express";
import Staff from "../models/staff";

export const getStaffs: RequestHandler = async (_, res) => {
  const staffs = await Staff.find();

  res.status(200).json(staffs);
};
