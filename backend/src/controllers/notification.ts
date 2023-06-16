import { RequestHandler } from "express";
import { z } from "zod";
import Notification from "../models/notification";
import { isValidObjectId } from "mongoose";
import User from "../models/user";

export const getNotifications: RequestHandler = async (req, res) => {
  const notifications = await Notification.find({
    to: req.session.uid,
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("from", "-password");

  res.status(200).send(notifications);
};

export const addNotification: RequestHandler = async (req, res) => {
  const bodySchema = z
    .object({
      description: z.string().min(1, "Description cannot be empty"),
      type: z.enum(["Appointment"]),
      to: z.string().min(1, "User cannot be empty"),
    })
    .refine(({ to }) => isValidObjectId(to), {
      message: "Invalid user ID",
    });

  const bodyParse = bodySchema.safeParse(req.body);

  if (!bodyParse.success) {
    res.status(400).send(bodyParse.error.flatten());
    return;
  }

  const { description, type, to } = req.body as z.infer<typeof bodySchema>;

  const existingUser = await User.findById(to);

  if (!existingUser || existingUser.isDeleted) {
    res.status(400).send({ message: "User does not exist" });
    return;
  }

  const newNotification = await Notification.create({
    description,
    type,
    to,
    from: req.session.uid,
  });

  res.status(200).send(newNotification);
};

export const readNotifications: RequestHandler = async (req, res) => {
  const notifications = await Notification.find({
    to: req.session.uid,
    isRead: false,
  });

  const readNotifications = await Promise.all(
    notifications.map(async (notification) => {
      notification.isRead = true;

      await notification.save();

      return notification;
    })
  );

  res.status(200).send(readNotifications);
};
