import jwt, { JwtPayload } from "jsonwebtoken";
import { RequestHandler } from "express";
import { z } from "zod";
import { sendEmail } from "../utilities/sendEmail";
import { emailVerification } from "../templates/emailVerification";
import User from "../models/user";
import EmailRequest from "../models/emailRequest";
import { resetPassword } from "../templates/resetPassword";

export const requestEmailVerification: RequestHandler = async (req, res) => {
  const schema = z.object({
    token: z.string({ required_error: "Token is required" }),
  });

  const parse = schema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).json(parse.error.flatten());
    return;
  }

  const { token } = req.body as z.infer<typeof schema>;

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {
    ignoreExpiration: true,
  }) as JwtPayload;

  if (decodedToken.exp && decodedToken.exp * 1000 > new Date().getTime()) {
    res.status(400).json({ message: "Token is still valid" });
    return;
  }

  const existingToken = await EmailRequest.findOne({ token });

  if (existingToken) {
    res.status(400).json({ message: "Can't request another link" });
    return;
  }

  const user = await User.findById(decodedToken._id);

  if (!user || user.isDeleted) {
    res.status(400).json({ message: "User does not exist" });
    return;
  }

  if (user.verified) {
    res.status(400).json({ message: "Account has been already verified" });
    return;
  }

  const emailVerificationToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  await sendEmail({
    Messages: [
      {
        From: {
          Email: process.env.EMAIL_SENDER,
        },
        To: [
          {
            Email: user.email,
          },
        ],
        Subject: "Verify your email address",
        HTMLPart: emailVerification(user.name.firstName, emailVerificationToken),
      },
    ],
  });

  await EmailRequest.create({ token });

  res.status(200).json({
    message: "Successfully requested another email verification link",
  });
};

export const requestResetPassword: RequestHandler = async (req, res) => {
  const schema = z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid Email"),
  });

  const parse = schema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).json(parse.error.flatten());
    return;
  }

  const { email } = req.body as z.infer<typeof schema>;

  const existingEmailRequest = await EmailRequest.findOne({ email });

  if (existingEmailRequest) {
    let emailRequestExpirationDate = new Date(existingEmailRequest.updatedAt);

    emailRequestExpirationDate = new Date(
      emailRequestExpirationDate.setDate(emailRequestExpirationDate.getDate() + 3)
    );

    if (emailRequestExpirationDate.getTime() > new Date().getTime()) {
      res.status(400).json({ message: "Can't request another reset password link yet" });
      return;
    }
  }

  const user = await User.findOne({ email });

  if (!user || user.isDeleted) {
    res.status(400).json({ message: "User does not exist" });
    return;
  }

  const resetPasswordToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  await sendEmail({
    Messages: [
      {
        From: {
          Email: process.env.EMAIL_SENDER,
        },
        To: [
          {
            Email: user.email,
          },
        ],
        Subject: "Reset your password",
        HTMLPart: resetPassword(user.name.firstName, resetPasswordToken),
      },
    ],
  });

  if (!existingEmailRequest) {
    await EmailRequest.create({ email });
  } else {
    existingEmailRequest.updatedAt = new Date();

    await existingEmailRequest.save();
  }

  res.status(200).json({
    message: "Successfully requested a reset password link",
  });
};
