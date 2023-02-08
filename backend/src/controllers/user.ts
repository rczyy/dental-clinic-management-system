import { RequestHandler } from "express";
import { z } from "zod";
import { compare } from "bcrypt";
import { Roles } from "../constants";
import { verifyToken } from "../utilities/verifyToken";
import jwt from "jsonwebtoken";
import User from "../models/user";

export const getUsers: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    res.status(401).json({ message: token.message });
    return;
  }

  if (token.role !== Roles.Admin && token.role !== Roles.Manager) {
    res.status(401).json({ message: "Unauthorized to do this" });
    return;
  }

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
  const token = jwt.sign({ role: existingUser.role }, process.env.JWT_SECRET);

  res.status(200).json({ user: existingUser, token });
};

export const logoutUser: RequestHandler = (req, res) => {
  req.session.destroy(() =>
    res.status(200).json({ message: "Successfully logged out" })
  );
};
