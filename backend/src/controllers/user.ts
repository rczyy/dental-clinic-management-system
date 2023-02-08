import { RequestHandler } from "express";
import { z } from "zod";
import { compare } from "bcrypt";
import User from "../models/user";

export const getUsers: RequestHandler = async (_, res) => {
  const users = await User.find();

  res.status(200).json(users);
};

export const getMe: RequestHandler = async (req, res) => {
  const me = await User.findById(req.session.uid);

  res.status(200).json(me);
};

export const loginUser: RequestHandler = async (req, res) => {
  const userSchema = z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email"),
    password: z.string({ required_error: "Password is required" }),
  });

  type body = z.infer<typeof userSchema>;

  const parse = userSchema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).json(parse.error.flatten());
    return;
  }

  const { email, password }: body = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    const error: ErrorBody = {
      formErrors: ["Invalid credentials"],
    };

    res.status(401).json(error);
    return;
  }

  const samePassword = await compare(password, existingUser.password);

  if (!samePassword) {
    const error: ErrorBody = {
      formErrors: ["Invalid credentials"],
    };

    res.status(401).json(error);
    return;
  }

  req.session.uid = existingUser._id;

  res.status(200).json(existingUser);
};
