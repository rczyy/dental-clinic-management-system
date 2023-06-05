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
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role !== Roles.Admin) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const admins = await Admin.find();

  res.status(200).json(admins);
};

export const registerAdmin: RequestHandler = async (req, res) => {
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
        .min(6, "Password must be atleast 6 characters"),
      confirmPassword: z
        .string({ required_error: "Confirm your password" })
        .min(1, "Confirm your password"),
      contactNo: z
        .string({ required_error: "Contact number is required" })
        .min(1, "Contact number cannot be empty")
        .regex(/(^\+639)\d{9}$/, "Invalid contact number")
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords doesn't match"
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
    contactNo
  }: body = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error: FormError = {
      formErrors: ["User already exists"]
    };

    res.status(400).json(error);
    return;
  }

  const hashedPassword = await hash(password, 10);

  const user = new User({
    name: {
      firstName,
      middleName,
      lastName
    },
    address: {
      region,
      province,
      city,
      barangay,
      street
    },
    email,
    password: hashedPassword,
    contactNo,
    role: Roles.Admin,
    verified: true
  });

  const admin = new Admin({
    user: user._id
  });

  await user.save();
  await admin.save();

  res.status(201).json(user);
};
