import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { hash } from "bcrypt";
import { Roles } from "../constants";
import { verifyToken } from "../utilities/verifyToken";
import User from "../models/user";
import Staff from "../models/staff";
import Manager from "../models/manager";
import Assistant from "../models/assistant";
import Dentist from "../models/dentist";
import FrontDesk from "../models/frontDesk";

export const getStaffs: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    res.status(401).json({ message: token.message });
    return;
  }

  if (token.role !== Roles.Admin && token.role !== Roles.Manager) {
    res.status(401).json({ message: "Unauthorized to do this" });
    return;
  }

  const staffs = await Staff.find();

  res.status(200).json(staffs);
};

export const getStaff: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    res.status(401).json({ message: token.message });
    return;
  }

  if (token.role !== Roles.Admin && token.role !== Roles.Manager) {
    res.status(401).json({ message: "Unauthorized to do this" });
    return;
  }

  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  const staff = await Staff.findOne({ userId });

  res.status(200).json(staff);
};

export const registerStaff: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    res.status(401).json({ message: token.message });
    return;
  }

  if (token.role !== Roles.Admin && token.role !== Roles.Manager) {
    res.status(401).json({ message: "Unauthorized to do this" });
    return;
  }

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
        .min(6, "Password must be atleast 6 characters"),
      confirmPassword: z.string({
        required_error: "Confirm your password",
      }),
      contactNo: z
        .string({ required_error: "Invalid contact number" })
        .startsWith("+63", "Invalid contact number")
        .length(13, "Invalid contact number"),
      role: z.nativeEnum(Roles),
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
    role,
  }: body = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error: ErrorBody = {
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
    const error: ErrorBody = {
      formErrors: ["Invalid role"],
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
    role,
  });

  const staff = new Staff({
    userId: user._id,
  });

  await user.save();
  await staff.save();

  if (role === Roles.Manager) {
    const manager = new Manager({
      staffId: staff._id,
    });
    await manager.save();
  }
  if (role === Roles.Assistant) {
    const assistant = new Assistant({
      staffId: staff._id,
    });
    await assistant.save();
  }
  if (role === Roles.Dentist) {
    const dentist = new Dentist({
      staffId: staff._id,
    });
    await dentist.save();
  }
  if (role === Roles.FrontDesk) {
    const frontDesk = new FrontDesk({
      staffId: staff._id,
    });
    await frontDesk.save();
  }

  res.status(201).json(user);
};

export const removeStaff: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    res.status(401).json({ message: token.message });
    return;
  }

  if (token.role !== Roles.Admin && token.role !== Roles.Manager) {
    res.status(401).json({ message: "Unauthorized to do this" });
    return;
  }

  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  const deletedStaff = await Staff.findOneAndDelete({ userId });

  if (!deletedStaff) {
    res.status(400).json({ message: "Staff doesn't exist" });
    return;
  }

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    res.status(400).json({ message: "User doesn't exist" });
    return;
  }

  if (deletedUser.role === Roles.Manager) {
    await Manager.findOneAndDelete({ staffId: deletedStaff._id });
  }

  if (deletedUser.role === Roles.Assistant) {
    await Assistant.findOneAndDelete({ staffId: deletedStaff._id });
  }

  if (deletedUser.role === Roles.Dentist) {
    await Dentist.findOneAndDelete({ staffId: deletedStaff._id });
  }

  if (deletedUser.role === Roles.FrontDesk) {
    await FrontDesk.findOneAndDelete({ staffId: deletedStaff._id });
  }

  res
    .status(200)
    .json({ _id: deletedUser._id, message: "Succesfully deleted the staff" });
};
