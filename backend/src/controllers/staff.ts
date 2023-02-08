import { RequestHandler } from "express";
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
      contactNo: z.union([
        z
          .string({ required_error: "Invalid contact number" })
          .startsWith("+63", "Invalid contact number")
          .length(13, "Invalid contact number"),
        z
          .string({ required_error: "Invalid contact number" })
          .startsWith("09", "Invalid contact number")
          .length(11, "Invalid contact number"),
      ]),
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
