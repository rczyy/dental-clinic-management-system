import jwt, { JwtPayload } from "jsonwebtoken";
import { RequestHandler } from "express";
import { z } from "zod";
import { sendEmail } from "../utilities/sendEmail";
import { emailVerification } from "../templates/emailVerification";
import User from "../models/user";
import RequestToken from "../models/requestToken";

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

  if (decodedToken.exp && new Date(decodedToken.exp) >= new Date()) {
    res.status(400).json({ message: "Token is still valid" });
    return;
  }

  const requestToken = await RequestToken.findOne({ token });

  if (requestToken) {
    res.status(400).json({ message: "Can't request another link" });
    return;
  }

  const user = await User.findById(decodedToken._id);

  if (!user) {
    res.status(400).json({ message: "User does not exist" });
    return;
  }

  if (user.verified) {
    res.status(400).json({ message: "Account has been already verified" });
    return;
  }

  const emailVerificationToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );

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
        HTMLPart: emailVerification(
          user.name.firstName,
          emailVerificationToken
        ),
      },
    ],
  });

  await RequestToken.create({ token });

  res.status(200).json({
    message: "Successfully requested another email verification link",
  });
};
