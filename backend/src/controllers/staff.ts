import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { Roles } from "../constants";
import { verifyToken } from "../utilities/verifyToken";
import User from "../models/user";
import Staff from "../models/staff";
import Manager from "../models/manager";
import Assistant from "../models/assistant";
import Dentist from "../models/dentist";
import FrontDesk from "../models/frontDesk";
import { sendEmail } from "../utilities/sendEmail";
import { changePasswordStaff } from "../templates/changePasswordStaff";
import jwt from "jsonwebtoken";

export const getStaffs: RequestHandler = async (req, res) => {
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

  const staffs = await Staff.find().populate("user", "-password");

  res.status(200).json(staffs);
};

export const getStaff: RequestHandler = async (req, res) => {
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

  const staff = await Staff.findOne({ user });

  res.status(200).json(staff);
};

export const registerStaff: RequestHandler = async (req, res) => {
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

  const userSchema = z.object({
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
    region: z.string().min(1, "Region cannot be empty").optional(),
    province: z.string().min(1, "Province cannot be empty").optional(),
    city: z.string().min(1, "City cannot be empty").optional(),
    barangay: z.string().min(1, "Barangay cannot be empty").optional(),
    street: z.string().min(1, "Street cannot be empty").optional(),
    email: z.string({ required_error: "Email is required" }).email(),
    contactNo: z
      .string()
      .regex(/(^\+63)\d{10}$/, "Invalid contact number")
      .optional(),
    role: z.nativeEnum(Roles),
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
    role,
  }: body = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error: FormError = {
      formErrors: ["User already exists"],
    };

    res.status(400).json(error);
    return;
  }

  if (
    role !== Roles.Assistant &&
    role !== Roles.Dentist &&
    role !== Roles.FrontDesk &&
    role !== Roles.Manager
  ) {
    const error: FormError = {
      formErrors: ["Invalid role"],
    };

    res.status(400).json(error);
    return;
  }

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
    contactNo,
    role,
    verified: true,
  });

  const staff = new Staff({
    user: user._id,
  });

  await user.save();
  await staff.save();

  if (role === Roles.Manager) {
    const manager = new Manager({
      staff: staff._id,
    });
    await manager.save();
  }
  if (role === Roles.Assistant) {
    const assistant = new Assistant({
      staff: staff._id,
    });
    await assistant.save();
  }
  if (role === Roles.Dentist) {
    const dentist = new Dentist({
      staff: staff._id,
    });
    await dentist.save();
  }
  if (role === Roles.FrontDesk) {
    const frontDesk = new FrontDesk({
      staff: staff._id,
    });
    await frontDesk.save();
  }

  const changePasswordStaffToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET
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
        Subject: `Welcome to AT Dental Home`,
        HTMLPart: changePasswordStaff(firstName, changePasswordStaffToken),
      },
    ],
  });

  res.status(201).json(user);
};

export const removeStaff: RequestHandler = async (req, res) => {
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

  const deletedStaff = await Staff.findOneAndDelete({ user });

  if (!deletedStaff) {
    const error: ErrorMessage = { message: "Staff doesn't exist" };
    res.status(400).json(error);
    return;
  }

  const deletedUser = await User.findByIdAndDelete(user);

  if (!deletedUser) {
    res.status(400).json({ message: "User doesn't exist" });
    return;
  }

  if (deletedUser.role === Roles.Manager) {
    await Manager.findOneAndDelete({ staff: deletedStaff._id });
  }

  if (deletedUser.role === Roles.Assistant) {
    await Assistant.findOneAndDelete({ staff: deletedStaff._id });
  }

  if (deletedUser.role === Roles.Dentist) {
    await Dentist.findOneAndDelete({ staff: deletedStaff._id });
  }

  if (deletedUser.role === Roles.FrontDesk) {
    await FrontDesk.findOneAndDelete({ staff: deletedStaff._id });
  }

  res
    .status(200)
    .json({ _id: deletedUser._id, message: "Succesfully deleted the staff" });
};
