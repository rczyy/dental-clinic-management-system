import { RequestHandler } from "express";
import { z } from "zod";
import { compare } from "bcrypt";
import { Roles } from "../constants";
import { verifyToken } from "../utilities/verifyToken";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { JwtPayload } from "jsonwebtoken";

export const getUsers: RequestHandler = async (req, res) => {
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

  const users = await User.find().select("-password");

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
    const error: FormError = {
      formErrors: ["Invalid credentials"],
    };

    res.status(401).json(error);
    return;
  }

  const samePassword = await compare(password, existingUser.password);

  if (!samePassword) {
    const error: FormError = {
      formErrors: ["Invalid credentials"],
    };

    res.status(401).json(error);
    return;
  }

  req.session.uid = existingUser._id;
  const token = jwt.sign({ role: existingUser.role }, process.env.JWT_SECRET);

  res.status(200).json({ user: existingUser, token });
};

export const verifyUser: RequestHandler = async (req, res) => {
  const schema = z.object({
    token: z.string({ required_error: "Token is required" }),
  });

  const parse = schema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).json(parse.error.flatten());
    return;
  }

  const { token } = req.body as z.infer<typeof schema>;

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
    return;
  }

  const userToVerify = await User.findById(decodedToken._id);

  if (!userToVerify) {
    res.status(400).json({ message: "User does not exist" });
    return;
  }

  if (userToVerify.verified) {
    res.status(200).json({ message: "Account has been already verified" });
    return;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userToVerify._id,
    {
      verified: true,
    },
    { new: true }
  );

  if (!updatedUser) {
    res.status(400).json({ message: "User does not exist" });
    return;
  }

  res.status(200).json({ message: "Account has been successfully verified" });
};

export const logoutUser: RequestHandler = (req, res) => {
  req.session.destroy(() =>
    res.status(200).json({ message: "Successfully logged out" })
  );
};
