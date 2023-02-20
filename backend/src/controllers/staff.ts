import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { hash } from "bcrypt";
import { Roles } from "../constants";
import { verifyToken } from "../utilities/verifyToken";
import { generateRandomPass } from "../utilities/generatePassword";
import User from "../models/user";
import Staff from "../models/staff";
import Manager from "../models/manager";
import Assistant from "../models/assistant";
import Dentist from "../models/dentist";
import FrontDesk from "../models/frontDesk";

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

  const staffs = await Staff.find().populate("user");

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
    firstName: z.string({ required_error: "First name is required" }),
    middleName: z.string({ required_error: "Middle name is required" }),
    lastName: z.string({ required_error: "Last name is required" }),
    region: z.string({ required_error: "Region is required" }),
    province: z.string({ required_error: "Province is required" }),
    city: z.string({ required_error: "City is required" }),
    barangay: z.string({ required_error: "Barangay is required" }),
    street: z.string({ required_error: "Street is required" }),
    email: z.string({ required_error: "Email is required" }).email(),
    contactNo: z
      .string({ required_error: "Invalid contact number" })
      .startsWith("+63", "Invalid contact number")
      .length(13, "Invalid contact number"),
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

  const password = generateRandomPass();
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
    role,
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
