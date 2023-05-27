import { RequestHandler } from "express";
import { z } from "zod";
import { compare, hash } from "bcrypt";
import { Roles } from "../constants";
import { verifyToken } from "../utilities/verifyToken";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { JwtPayload } from "jsonwebtoken";
import EmailRequest from "../models/emailRequest";
import { isValidObjectId } from "mongoose";
import { imageUpload } from "../utilities/imageUpload";

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

export const getUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (
    (token.role !== Roles.Admin &&
      token.role !== Roles.Manager &&
      token.role !== Roles.Dentist &&
      token.role !== Roles.Assistant &&
      token.role !== Roles.FrontDesk &&
      token.role !== Roles.Patient) ||
    (token.role === Roles.Patient && req.session.uid !== id)
  ) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const user = await User.findById(id).select("-password");

  res.status(200).json(user);
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

  const samePassword = existingUser.password
    ? await compare(password, existingUser.password)
    : false;

  if (!samePassword) {
    const error: FormError = {
      formErrors: ["Invalid credentials"],
    };

    res.status(401).json(error);
    return;
  }

  req.session.uid = existingUser._id.toString();
  const token = jwt.sign({ role: existingUser.role }, process.env.JWT_SECRET);

  res.status(200).json({ user: existingUser, token });
};

export const editUser: RequestHandler = async (req, res) => {
  const paramsSchema = z.object({
    id: z
      .string({ required_error: "ID is required" })
      .min(1, "ID cannot be empty")
      .refine((val) => isValidObjectId(val), { message: "Invalid ID" }),
  });

  const paramsParse = paramsSchema.safeParse(req.params);

  if (!paramsParse.success) {
    res.status(400).json(paramsParse.error.flatten());
    return;
  }

  const { id } = req.params as z.infer<typeof paramsSchema>;

  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role !== Roles.Admin && req.session.uid !== id) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const userSchema = z
    .object({
      firstName: z
        .string({ required_error: "First name is required" })
        .min(1, "First name cannot be empty")
        .regex(/^[A-Za-zÑñ. ]+$/, "Invalid first name")
        .optional(),
      middleName: z
        .string()
        .min(1, "Middle name cannot be empty")
        .regex(/^[A-Za-zÑñ ]+$/, "Invalid middle name")
        .optional(),
      lastName: z
        .string({ required_error: "Last name is required" })
        .min(1, "Last name cannot be empty")
        .regex(/^[A-Za-zÑñ ]+$/, "Invalid last name")
        .optional(),
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
        .regex(/(^\+639)\d{9}$/, "Invalid contact number")
        .optional(),
      role: z.nativeEnum(Roles).optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords doesn't match",
    });

  const userParse = userSchema.safeParse(req.body);

  if (!userParse.success) {
    res.status(400).json(userParse.error.flatten());
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
    contactNo,
    password,
    role,
  } = req.body as z.infer<typeof userSchema>;

  const { file } = req;

  if (role && token.role !== Roles.Admin) {
    res.status(400).send({ message: "Unauthorized to edit a user's role" });
    return;
  }

  let avatar;

  if (file) {
    // if (token.role === Roles.Patient) {
    //   res.status(400).send({ message: "Unauthorized to edit a user's avatar" });
    //   return;
    // }

    const folder = "avatars/";
    const object = await imageUpload(folder, file);

    avatar = object.Location;
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
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
      contactNo,
      password: password && (await hash(password, 10)),
      role,
      avatar,
    },
    {
      new: true,
    }
  ).select("-password");

  if (!updatedUser) {
    res.status(400).send({ message: "User does not exist" });
    return;
  }

  res.status(200).send(updatedUser);
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

export const resetPasswordUser: RequestHandler = async (req, res) => {
  const schema = z
    .object({
      token: z
        .string({ required_error: "Token is required" })
        .min(1, "Token cannot be empty"),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be atleast 6 characters"),
      confirmPassword: z.string({ required_error: "Confirm your password" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords doesn't match",
    });

  const parse = schema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).json(parse.error.flatten());
    return;
  }

  const { token, password } = req.body as z.infer<typeof schema>;

  let decodedToken: JwtPayload;
  const existingToken = await EmailRequest.findOne({ token });

  if (existingToken) {
    res.status(400).json({ message: "Invalid token" });
    return;
  }

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
    return;
  }

  if (!decodedToken._id) {
    res.status(400).json({ message: "Token doesn't have an id payload" });
    return;
  }

  const user = await User.findById(decodedToken._id);

  if (!user) {
    res.status(400).json({ message: "User does not exist" });
    return;
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      password: await hash(password, 10),
    },
    { new: true }
  );

  if (!updatedUser) {
    res.status(400).json({ message: "Updated user does not exist" });
    return;
  }

  await EmailRequest.create({
    token,
  });

  res.status(200).json({ message: "Reset account password successful" });
};

export const logoutUser: RequestHandler = (req, res) => {
  req.session.destroy(() =>
    res.status(200).json({ message: "Successfully logged out" })
  );
};
