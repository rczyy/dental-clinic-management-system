import { RequestHandler } from "express";
import { verifyToken } from "../utilities/verifyToken";
import Service from "../models/service";
import { LogModule, LogType, Roles, ServiceCategory } from "../constants";
import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { addLog } from "../utilities/addLog";

export const getServices: RequestHandler = async (_, res) => {
  const services = await Service.find({ isDeleted: false });

  res.status(200).json(services);
};
export const getDeletedServices: RequestHandler = async (req, res) => {
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

  const services = await Service.find({ isDeleted: true });

  res.status(200).json(services);
};
export const getService: RequestHandler = async (req, res) => {
  const { service } = req.params;

  if (!isValidObjectId(service)) {
    const error: ErrorMessage = { message: "Invalid service ID" };
    res.status(400).json(error);
    return;
  }

  const serviceRes = await Service.findOne({ _id: service });

  res.status(200).json(serviceRes);
};
export const addService: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (
    token.role !== Roles.Admin &&
    token.role !== Roles.Manager &&
    token.role !== Roles.Dentist &&
    token.role !== Roles.Assistant &&
    token.role !== Roles.FrontDesk
  ) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const userSchema = z.object({
    name: z.string({ required_error: "Name is required" }),
    estimatedTime: z
      .string({ required_error: "Estimated time is required" })
      .regex(/^[0-9]*$/, "Estimated time may only contain numbers"),
    category: z.nativeEnum(ServiceCategory)
  });

  type body = z.infer<typeof userSchema>;

  const parse = userSchema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).json(parse.error.flatten());
    return;
  }

  const { name, estimatedTime, category }: body = req.body;

  const existingService = await Service.findOne({ name });

  if (existingService) {
    const error: FormError = {
      formErrors: ["Service already exists"]
    };

    res.status(400).json(error);
    return;
  }

  const service = new Service({
    name,
    estimatedTime,
    category
  });

  await addLog(req.session.uid!, LogModule[4], LogType[0], service);

  await service.save();
  res.status(201).json(service);
};
export const editService: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (
    token.role !== Roles.Admin &&
    token.role !== Roles.Manager &&
    token.role !== Roles.Dentist &&
    token.role !== Roles.Assistant &&
    token.role !== Roles.FrontDesk
  ) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const userSchema = z.object({
    name: z.string().optional(),
    estimatedTime: z
      .string()
      .regex(/^[0-9]*$/, "Estimated time may only contain numbers")
      .optional(),
    category: z.nativeEnum(ServiceCategory).optional()
  });

  type body = z.infer<typeof userSchema>;

  const parse = userSchema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).json(parse.error.flatten());
    return;
  }

  const { name, estimatedTime, category }: body = req.body;
  const { service } = req.params;

  if (!isValidObjectId(service)) {
    const error: ErrorMessage = { message: "Invalid service ID" };
    res.status(400).json(error);
    return;
  }

  const editedService = await Service.findByIdAndUpdate(
    service,
    {
      name,
      estimatedTime,
      category
    },
    {
      new: true
    }
  );

  if (!editedService) {
    const error: ErrorMessage = { message: "Service doesn't exist" };
    res.status(400).json(error);
    return;
  }
  
  await addLog(req.session.uid!, LogModule[4], LogType[1], editedService);

  res.status(200).json(service);
};
export const recoverService: RequestHandler = async (req, res) => {
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

  const { service } = req.params;

  if (!isValidObjectId(service)) {
    const error: ErrorMessage = { message: "Invalid service ID" };
    res.status(400).json(error);
    return;
  }

  const recoveredService = await Service.findByIdAndUpdate(service, {
    $set: {
      isDeleted: false,
    },
  });

  if (!recoveredService) {
    const error: ErrorMessage = { message: "Service doesn't exist" };
    res.status(400).json(error);
    return;
  }

  res.status(200).send(recoveredService);
};
export const removeService: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (
    token.role !== Roles.Admin &&
    token.role !== Roles.Manager &&
    token.role !== Roles.Dentist &&
    token.role !== Roles.Assistant &&
    token.role !== Roles.FrontDesk
  ) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const { service } = req.params;

  if (!isValidObjectId(service)) {
    const error: ErrorMessage = { message: "Invalid service ID" };
    res.status(400).json(error);
    return;
  }

  const deletedService = await Service.findByIdAndUpdate(service, {
    $set: {
      isDeleted: true,
    },
  });

  if (!deletedService || deletedService.isDeleted) {
    const error: ErrorMessage = { message: "Service doesn't exist" };
    res.status(400).json(error);
    return;
  }

  await addLog(req.session.uid!, LogModule[4], LogType[2], deletedService);

  res.status(200).json({
    _id: deletedService._id,
    message: "Succesfully deleted the service"
  });
};
