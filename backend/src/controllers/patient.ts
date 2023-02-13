import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { hash } from "bcrypt";
import { Roles } from "../constants";
import { verifyToken } from "../utilities/verifyToken";
import Patient from "../models/patient";
import User from "../models/user";

export const getPatients: RequestHandler = async (req, res) => {
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

  const patients = await Patient.find();

  res.status(200).json(patients);
};

export const getPatient: RequestHandler = async (req, res) => {
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

  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    const error: ErrorMessage = { message: "Invalid user ID" };
    res.status(400).json(error);
    return;
  }

  const patient = await Patient.findOne({ userId });

  res.status(200).json(patient);
};

export const registerPatient: RequestHandler = async (req, res) => {
  const userSchema = z
    .object({
      firstName: z.string({ required_error: "First name is required" }),
      middleName: z.string({ required_error: "Middle name is required" }),
      lastName: z.string({ required_error: "Last name is required" }),
      region: z.string({ required_error: "Region is required" }),
      province: z.string({ required_error: "Province is required" }),
      city: z.string({ required_error: "City is required" }),
      barangay: z.string({ required_error: "Barangay is required" }),
      street: z.string({ required_error: "Street is required" }),
      email: z.string({ required_error: "Email is required" }).email(),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string({ required_error: "Confirm your password" }),
      contactNo: z
        .string({ required_error: "Invalid contact number" })
        .startsWith("+63", "Invalid contact number")
        .length(13, "Invalid contact number"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords doesn't match",
    });

  type body = z.infer<typeof userSchema>;

  const parse = userSchema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).json(parse.error.flatten());
    return;
  }

  const {
    firstName,
    middleName,
    lastName,
    region,
    province,
    city,
    barangay,
    street,
    email,
    password,
    contactNo,
  }: body = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error: FormError = {
      formErrors: ["User already exists"],
    };

    res.status(400).json(error);
    return;
  }

  const hashedPassword = await hash(password, 10);

  const user = new User({
    name: {
      firstName,
      middleName,
      lastName,
    },
    address: {
      region,
      province,
      city,
      barangay,
      street,
    },
    email,
    password: hashedPassword,
    contactNo,
    role: Roles.Patient,
  });

  const patient = new Patient({
    userId: user._id,
  });

  await user.save();
  await patient.save();

  res.status(201).json(user);
};

export const removePatient: RequestHandler = async (req, res) => {
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

  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    const error: ErrorMessage = { message: "Invalid user ID" };
    res.status(400).json(error);
    return;
  }
  const deletedPatient = await Patient.findOneAndDelete({ userId });

  if (!deletedPatient) {
    const error: ErrorMessage = { message: "Patient doesn't exist" };
    res.status(400).json(error);
    return;
  }

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    const error: ErrorMessage = { message: "User doesn't exist" };
    res.status(400).json(error);
    return;
  }

  res
    .status(200)
    .json({ _id: deletedUser._id, message: "Succesfully deleted the patient" });
};
