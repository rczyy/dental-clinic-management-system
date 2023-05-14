import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { hash } from "bcrypt";
import { Roles } from "../constants";
import { verifyToken } from "../utilities/verifyToken";
import Patient from "../models/patient";
import User from "../models/user";
import { sendEmail } from "../utilities/sendEmail";
import { emailVerification } from "../templates/emailVerification";
import jwt from "jsonwebtoken";

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

  const patients = await Patient.find().populate("user", "-password");

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

  const { user } = req.params;

  if (!isValidObjectId(user)) {
    const error: ErrorMessage = { message: "Invalid user ID" };
    res.status(400).json(error);
    return;
  }

  const patient = await Patient.findOne({ user });

  res.status(200).json(patient);
};

export const registerPatient: RequestHandler = async (req, res) => {
  const userSchema = z
    .object({
      firstName: z
        .string({ required_error: "First name is required" })
        .regex(/^[A-Za-z ]+$/, "First name may only contain letters"),
      middleName: z
        .string()
        .regex(/^[A-Za-z ]*$/, "Middle name may only contain letters")
        .optional(),
      lastName: z
        .string({ required_error: "Last name is required" })
        .regex(/^[A-Za-z ]+$/, "Last name may only contain letters"),
      region: z.string().optional(),
      province: z.string().optional(),
      city: z.string().optional(),
      barangay: z.string().optional(),
      street: z.string().optional(),
      email: z.string({ required_error: "Email is required" }).email(),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be atleast 6 characters"),
      confirmPassword: z
        .string({ required_error: "Confirm your password" })
        .min(1, "Confirm your password"),
      contactNo: z
        .string()
        .regex(/(^\+63)\d{10}$/, "Invalid contact number")
        .optional(),
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
    contactNo,
    password,
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
    verified: false,
  });

  const patient = new Patient({
    user: user._id,
  });

  await user.save();
  await patient.save();

  const emailVerificationToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );

  await sendEmail({
    Messages: [
      {
        From: {
          Email: process.env.EMAIL_SENDER,
        },
        To: [
          {
            Email: email,
          },
        ],
        Subject: "Verify your email address",
        HTMLPart: emailVerification(firstName, emailVerificationToken),
      },
    ],
  });

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

  const { user } = req.params;

  if (!isValidObjectId(user)) {
    const error: ErrorMessage = { message: "Invalid user ID" };
    res.status(400).json(error);
    return;
  }
  const deletedPatient = await Patient.findOneAndDelete({ user });

  if (!deletedPatient) {
    const error: ErrorMessage = { message: "Patient doesn't exist" };
    res.status(400).json(error);
    return;
  }

  const deletedUser = await User.findByIdAndDelete(user);

  if (!deletedUser) {
    const error: ErrorMessage = { message: "User doesn't exist" };
    res.status(400).json(error);
    return;
  }

  res
    .status(200)
    .json({ _id: deletedUser._id, message: "Succesfully deleted the patient" });
};
