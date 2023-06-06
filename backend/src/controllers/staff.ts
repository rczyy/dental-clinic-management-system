import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { LogModule, LogType, Roles } from "../constants";
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
import { addLog } from "../utilities/addLog";

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

  const staffs = await Staff.find({ isDeleted: false }).populate(
    "user",
    "-password"
  );

  res.status(200).json(staffs);
};

export const getDeletedStaffs: RequestHandler = async (req, res) => {
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

  const staffs = await Staff.find({ isDeleted: true }).populate(
    "user",
    "-password"
  );

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
    contactNo: z
      .string({ required_error: "Contact number is required" })
      .min(1, "Contact number cannot be empty")
      .regex(/(^\+639)\d{9}$/, "Invalid contact number"),
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

  await addLog(
    req.session.uid!,
    LogModule[0],
    LogType[0],
    user,
    user.role
  );

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

export const recoverStaff: RequestHandler = async (req, res) => {
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

  const recoveredStaff = await Staff.findOneAndUpdate(
    { user },
    {
      $set: {
        isDeleted: false,
      },
    }
  );

  if (!recoveredStaff) {
    const error: ErrorMessage = { message: "Staff doesn't exist" };
    res.status(400).json(error);
    return;
  }

  const recoveredUser = await User.findByIdAndUpdate(
    user,
    {
      $set: {
        isDeleted: false,
      },
    },
    {
      new: true,
    }
  );

  if (!recoveredUser) {
    const error: ErrorMessage = { message: "User doesn't exist" };
    res.status(400).json(error);
    return;
  }

  await addLog(
    req.session.uid!,
    LogModule[0],
    LogType[3],
    recoveredUser,
    recoveredUser.role
  );

  res.status(200).send(recoveredUser);
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

  const deletedStaff = await Staff.findOneAndUpdate(
    { user },
    {
      $set: {
        isDeleted: true,
      },
    }
  );

  if (!deletedStaff || deletedStaff.isDeleted) {
    const error: ErrorMessage = { message: "Staff doesn't exist" };
    res.status(400).json(error);
    return;
  }

  const deletedUser = await User.findByIdAndUpdate(user, {
    $set: {
      isDeleted: true,
    },
  });

  if (!deletedUser || deletedUser.isDeleted) {
    res.status(400).json({ message: "User doesn't exist" });
    return;
  }

  if (deletedUser.role === Roles.Manager) {
    await Manager.findOneAndUpdate(
      { staff: deletedStaff._id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
  }

  if (deletedUser.role === Roles.Assistant) {
    await Assistant.findOneAndUpdate(
      { staff: deletedStaff._id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
  }

  if (deletedUser.role === Roles.Dentist) {
    await Dentist.findOneAndUpdate(
      { staff: deletedStaff._id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
  }

  if (deletedUser.role === Roles.FrontDesk) {
    await FrontDesk.findOneAndUpdate(
      { staff: deletedStaff._id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
  }

  console.log(deletedUser)

  await addLog(
    req.session.uid!,
    LogModule[0],
    LogType[2],
    { name: deletedUser.name, email: deletedUser.email },
    deletedUser.role
  );

  res
    .status(200)
    .json({ _id: deletedUser._id, message: "Succesfully deleted the staff" });
};
