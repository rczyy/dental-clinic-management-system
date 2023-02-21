import { RequestHandler } from "express";
import { verifyToken } from "../utilities/verifyToken";
import Service from "../models/service";
import { Roles, ServiceCategory } from "../constants";
import { z } from "zod";
import { isValidObjectId } from "mongoose";

export const getServices: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  const services = await Service.find();

  res.status(200).json(services);
};
export const getService: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  const { serviceId } = req.params;

  if (!isValidObjectId(serviceId)) {
    const error: ErrorMessage = { message: "Invalid user ID" };
    res.status(400).json(error);
    return;
  }

  const service = await Service.findOne({ _id: serviceId });

  res.status(200).json(service);
};
export const getServiceCategory: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }
  const { category } = req.body;
  const serviceCategory = await Service.find({ category });

  res.status(200).json(serviceCategory);
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
    name: z
      .string({ required_error: "Name is required" })
      .regex(/^[A-Za-z]+$/, "Service name may only contain letters"),
    estimatedTime: z
      .string({ required_error: "Estimated time is required" })
      .regex(/^[0-9]*$/, "Estimated time may only contain numbers"),
    category: z.nativeEnum(ServiceCategory),
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
      formErrors: ["Service already exists"],
    };

    res.status(400).json(error);
    return;
  }

  const service = new Service({
    name,
    estimatedTime,
    category,
  });

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
    name: z
      .string()
      .regex(/^[A-Za-z]+$/, "Service name may only contain letters")
      .optional(),
    estimatedTime: z
      .string()
      .regex(/^[0-9]*$/, "Estimated time may only contain numbers")
      .optional(),
    category: z.nativeEnum(ServiceCategory).optional(),
  });

  type body = z.infer<typeof userSchema>;

  const parse = userSchema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).json(parse.error.flatten());
    return;
  }

  const { name, estimatedTime, category }: body = req.body;
  const { serviceId } = req.params;

  if (!isValidObjectId(serviceId)) {
    const error: ErrorMessage = { message: "Invalid service ID" };
    res.status(400).json(error);
    return;
  }

  const editedService = await Service.findOneAndUpdate({
    _id: serviceId,
    name,
    estimatedTime,
    category,
  });

  if (!editedService) {
    const error: ErrorMessage = { message: "Service doesn't exist" };
    res.status(400).json(error);
    return;
  }

  res.status(200).json({
    _id: editedService._id,
    message: "Succesfully edited the service",
  });
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

  const { serviceId } = req.params;

  if (!isValidObjectId(serviceId)) {
    const error: ErrorMessage = { message: "Invalid service ID" };
    res.status(400).json(error);
    return;
  }

  const deletedService = await Service.findOneAndDelete({ _id: serviceId });

  if (!deletedService) {
    const error: ErrorMessage = { message: "Service doesn't exist" };
    res.status(400).json(error);
    return;
  }

  res.status(200).json({
    _id: deletedService._id,
    message: "Succesfully deleted the service",
  });
};
