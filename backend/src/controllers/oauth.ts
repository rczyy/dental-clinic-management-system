import { RequestHandler } from "express";
import { OAuth2Client } from "google-auth-library";
import { z } from "zod";
import { decode, sign } from "jsonwebtoken";
import User from "../models/user";
import { Roles } from "../constants";
import Patient from "../models/patient";

export interface GoogleJwtPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: number;
  exp: number;
}

export const loginWithGoogle: RequestHandler = async (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    res.status(400).send({ message: "No provided google credentials" });
    return;
  }

  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "postmessage"
  );

  const schema = z.object({
    code: z
      .string({ required_error: "Google code is required" })
      .min(1, "Google code is required"),
  });

  const parse = schema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).send(parse.error.flatten());
    return;
  }

  const { tokens } = await oAuth2Client.getToken(req.body.code);

  if (!tokens.id_token) {
    res.status(400).send({ message: "No id token received" });
    return;
  }

  const userInfo = decode(tokens.id_token) as GoogleJwtPayload;
  console.log(userInfo)
  const existingUser = await User.findOne({ email: userInfo.email });

  if (!existingUser) {
    const user = new User({
      name: {
        firstName: userInfo.given_name,
        lastName: userInfo.family_name || "asdasd",
      },
      email: userInfo.email,
      role: Roles.Patient,
      verified: userInfo.email_verified,
    });

    const patient = new Patient({
      user: user._id,
    });

    await user.save();
    await patient.save();

    req.session.uid = user._id.toString();
    const token = sign({ role: user.role }, process.env.JWT_SECRET);

    res.status(200).json({ user: user, token });
    return;
  }

  req.session.uid = existingUser._id.toString();
  const token = sign({ role: existingUser.role }, process.env.JWT_SECRET);

  res.status(200).json({ user: existingUser, token });
};
