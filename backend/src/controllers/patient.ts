import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { hash } from "bcrypt";
import { LogModule, LogType, Roles } from "../constants";
import { verifyToken } from "../utilities/verifyToken";
import Patient from "../models/patient";
import User from "../models/user";
import { sendEmail } from "../utilities/sendEmail";
import { emailVerification } from "../templates/emailVerification";
import jwt from "jsonwebtoken";
import { addLog } from "../utilities/addLog";

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

  const patients = await Patient.find({ isDeleted: false }).populate(
    "user",
    "-password"
  );

  res.status(200).json(patients);
};

export const getDeletedPatients: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role === Roles.Patient) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const patients = await Patient.find({ isDeleted: true }).populate(
    "user",
    "-password"
  );

  res.status(200).json(patients);
};

export const getPatientNames: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (!token.role) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const patients = await Patient.find().populate({
    path: "user",
  });

  const response = patients.map((patient) => {
    const { user } = patient as unknown as {
      user: Pick<User, "_id" | "name" | "avatar">;
    };

    const { _id, name, avatar } = user;

    return {
      _id,
      name,
      avatar,
    };
  });

  res.status(200).json(response);
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
        .min(1, "First name cannot be empty")
        .regex(/^[A-Za-zÑñ. ]+$/, "Invalid first name"),
      middleName: z
        .string()
        .min(1, "Middle name cannot be empty")
        .regex(/^[A-Za-zÑñ ]+$/, "Invalid middle name")
        .optional(),
      lastName: z
        .string({ required_error: "Last name is required" })
        .min(1, "Last name cannot be empty")
        .regex(/^[A-Za-zÑñ ]+$/, "Invalid last name"),
      region: z
        .string()
        .min(1, "Region cannot be empty")
        .regex(/^[A-Za-z. -]+$/, "Invalid region")
        .optional(),
      province: z
        .string()
        .min(1, "Province cannot be empty")
        .regex(/^[A-Za-zÑñ.() -]+$/, "Invalid province")
        .optional(),
      city: z
        .string()
        .min(1, "City cannot be empty")
        .regex(/^[\dA-Za-zÑñ.() -]+$/, "Invalid city")
        .optional(),
      barangay: z
        .string()
        .min(1, "Barangay cannot be empty")
        .regex(/^[\dA-Za-zÑñ.() -]+$/, "Invalid barangay")
        .optional(),
      street: z
        .string()
        .min(1, "Street cannot be empty")
        .regex(/^[\dA-Za-zÑñ.() -]+$/, "Invalid street")
        .optional(),
      email: z.string({ required_error: "Email is required" }).email(),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be atleast 6 characters")
        .optional(),
      confirmPassword: z
        .string({ required_error: "Confirm your password" })
        .min(1, "Confirm your password")
        .optional(),
      contactNo: z
        .string({ required_error: "Contact number is required" })
        .min(1, "Contact number cannot be empty")
        .regex(/(^\+639)\d{9}$/, "Invalid contact number"),
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

  const hashedPassword = password ? await hash(password, 10) : undefined;

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

  await addLog(user._id, LogModule[0], LogType[0], user, user.role);

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

export const recoverPatient: RequestHandler = async (req, res) => {
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

  const recoveredPatient = await Patient.findOneAndUpdate(
    { user },
    {
      $set: {
        isDeleted: false,
      },
    }
  );

  if (!recoveredPatient) {
    const error: ErrorMessage = { message: "Patient doesn't exist" };
    res.status(400).json(error);
    return;
  }

  const recoveredUser = await User.findByIdAndUpdate(
    user,
    {
      $set: {
        isDeleted: false,
      },
    },
    {
      new: true,
    }
  );

  if (!recoveredUser) {
    const error: ErrorMessage = { message: "User doesn't exist" };
    res.status(400).json(error);
    return;
  }

  await addLog(
    req.session.uid!,
    LogModule[0],
    LogType[3],
    recoveredUser,
    "Patient"
  );

  res.status(200).send(recoveredUser);
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
  const deletedPatient = await Patient.findOneAndUpdate(
    { user },
    {
      $set: {
        isDeleted: true,
      },
    }
  );

  if (!deletedPatient || deletedPatient.isDeleted) {
    const error: ErrorMessage = { message: "Patient doesn't exist" };
    res.status(400).json(error);
    return;
  }

  const deletedUser = await User.findByIdAndUpdate(user, {
    $set: {
      isDeleted: true,
    },
  });

  if (!deletedUser || deletedUser.isDeleted) {
    const error: ErrorMessage = { message: "User doesn't exist" };
    res.status(400).json(error);
    return;
  }

  await addLog(
    req.session.uid!,
    LogModule[0],
    LogType[2],
    deletedUser,
    "Patient"
  );

  res
    .status(200)
    .json({ _id: deletedUser._id, message: "Succesfully deleted the patient" });
};
