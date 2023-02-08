import { RequestHandler } from "express";
import { z } from "zod";
import { hash } from "bcrypt";
import { Roles } from "../constants";
import { verifyToken } from "../utilities/verifyToken";
import Admin from "../models/admin";
import User from "../models/user";

export const getAdmins: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    res.status(401).json({ message: token.message });
    return;
  }

  if (token.role !== Roles.Admin) {
    res.status(401).json({ message: "Unauthorized to do this" });
    return;
  }

  const admins = await Admin.find();

  res.status(200).json(admins);
};

export const registerAdmin: RequestHandler = async (req, res) => {
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
      confirmPassword: z.string({ required_error: "Confirm your password" }),
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
    role: Roles.Admin,
  });

  const admin = new Admin({
    userId: user._id,
  });

  await user.save();
  await admin.save();

  res.status(201).json(user);
};
