import { RequestHandler } from "express";
import { verifyToken } from "../utilities/verifyToken";
import { LogModule, LogType, Roles } from "../constants";
import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { addLog } from "../utilities/addLog";
import dayjs from "dayjs";
import Patient from "../models/patient";
import Bill from "../models/bill";
import Appointment from "../models/appointment";

export const getBills: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role === Roles.Assistant || token.role === Roles.Patient) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const querySchema = z.object({
    date: z.coerce.date().optional(),
  });

  const queryParse = querySchema.safeParse(req.query);

  if (!queryParse.success) {
    res.status(400).send(queryParse.error.flatten());
    return;
  }

  const { date } = req.query;

  const bills = await Bill.find({
    ...(date && {
      createdAt: {
        $gte: dayjs(date.toString()),
        $lt: dayjs(date.toString()).format("YYYY-MM-DDT23:59:59"),
      },
    }),
    isDeleted: false,
  })
    .populate({
      path: "appointment",
      populate: {
        path: "dentist",
        populate: {
          path: "staff",
          populate: {
            path: "user",
          },
        },
      },
    })
    .populate({
      path: "appointment",
      populate: {
        path: "patient",
        populate: {
          path: "user",
        },
      },
    })
    .populate({
      path: "appointment",
      populate: {
        path: "service",
      },
    });

  res.status(200).send(bills);
};

export const getDeletedBills: RequestHandler = async (req, res) => {
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

  const querySchema = z.object({
    date: z.coerce.date().optional(),
  });

  const queryParse = querySchema.safeParse(req.query);

  if (!queryParse.success) {
    res.status(400).send(queryParse.error.flatten());
    return;
  }

  const { date } = req.query;

  const bills = await Bill.find({
    ...(date && {
      createdAt: {
        $gte: dayjs(date.toString()),
        $lt: dayjs(date.toString()).format("YYYY-MM-DDT23:59:59"),
      },
    }),
    isDeleted: true,
  })
    .populate({
      path: "appointment",
      populate: {
        path: "dentist",
        populate: {
          path: "staff",
          populate: {
            path: "user",
          },
        },
      },
    })
    .populate({
      path: "appointment",
      populate: {
        path: "patient",
        populate: {
          path: "user",
        },
      },
    })
    .populate({
      path: "appointment",
      populate: {
        path: "service",
      },
    });

  res.status(200).send(bills);
};

export const getPatientBills: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (!token.role) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const paramsSchema = z
    .object({
      userId: z.string({ required_error: "User ID is required" }),
    })
    .refine(({ userId }) => isValidObjectId(userId), {
      message: "Invalid user ID",
    });

  const paramsParse = paramsSchema.safeParse(req.params);

  if (!paramsParse.success) {
    res.status(400).send(paramsParse.error.flatten());
    return;
  }

  const schema = z.object({
    notes: z.string().optional(),
    price: z.coerce
      .number()
      .positive("Price must be a positive number")
      .finite("Infinite price are not allowed")
      .optional(),
  });

  const parse = schema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).send(parse.error.flatten());
    return;
  }

  const { userId } = req.params as z.infer<typeof paramsSchema>;

  const existingPatient = await Patient.findOne({ user: userId });

  if (!existingPatient) {
    res.status(400).send({ message: "Patient does not exist" });
    return;
  }

  const patientFinishedAppointments = await Appointment.find({
    patient: existingPatient._id,
    isFinished: true,
  });

  const bills = await Promise.all(
    patientFinishedAppointments.map(
      async (appointment) =>
        await Bill.findOne({
          appointment: appointment._id,
        })
          .populate({
            path: "appointment",
            populate: {
              path: "dentist",
              populate: {
                path: "staff",
                populate: {
                  path: "user",
                },
              },
            },
          })
          .populate({
            path: "appointment",
            populate: {
              path: "patient",
              populate: {
                path: "user",
              },
            },
          })
          .populate({
            path: "appointment",
            populate: {
              path: "service",
            },
          })
    )
  );

  res.status(200).send(bills);
};

export const addBill: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role === Roles.Assistant || token.role === Roles.Patient) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const schema = z
    .object({
      appointment: z.string({ required_error: "Appointment is required" }),
      notes: z.string().optional(),
      price: z.coerce
        .number({ required_error: "Price is required" })
        .positive("Price must be a positive number")
        .finite("Infinite price are not allowed"),
    })
    .refine(({ appointment }) => isValidObjectId(appointment), {
      message: "Appointment is invalid",
    });

  const parse = schema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).send(parse.error.flatten());
    return;
  }

  const { appointment, notes, price } = req.body as z.infer<typeof schema>;

  const existingAppointment = await Appointment.findById(appointment);

  if (!existingAppointment) {
    res.status(400).send({ message: "Appointment does not exist" });
    return;
  }

  if (existingAppointment.isFinished) {
    const error: ErrorMessage = {
      message: "Appointment is already finished",
    };
    res.status(400).json(error);
    return;
  }

  if (dayjs().isBefore(dayjs(existingAppointment.dateTimeScheduled))) {
    const error: ErrorMessage = {
      message: "Can't end an appointment that hasn't been started",
    };
    res.status(400).json(error);
    return;
  }

  existingAppointment.dateTimeFinished = new Date();
  existingAppointment.isFinished = true;

  await existingAppointment.save().catch((err) => {
    throw new Error(err);
  });

  const newBill = await Bill.create({
    appointment,
    notes,
    price,
  });

  await addLog(
    req.session.uid!,
    LogModule[5],
    LogType[0],
    newBill,
  );

  res.status(200).send(newBill);
};

export const editBill: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role === Roles.Assistant || token.role === Roles.Patient) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const paramsSchema = z
    .object({
      billId: z.string({ required_error: "Bill ID is required" }),
    })
    .refine(({ billId }) => isValidObjectId(billId), {
      message: "Invalid bill ID",
    });

  const paramsParse = paramsSchema.safeParse(req.params);

  if (!paramsParse.success) {
    res.status(400).send(paramsParse.error.flatten());
    return;
  }

  const schema = z.object({
    notes: z.string().optional(),
    price: z.coerce
      .number()
      .positive("Price must be a positive number")
      .finite("Infinite price are not allowed")
      .optional(),
  });

  const parse = schema.safeParse(req.body);

  if (!parse.success) {
    res.status(400).send(parse.error.flatten());
    return;
  }

  const { billId } = req.params as z.infer<typeof paramsSchema>;
  const { notes, price } = req.body as z.infer<typeof schema>;

  const existingBill = await Bill.findById(billId);

  if (!existingBill || existingBill.isDeleted) {
    res.status(400).send({ message: "Bill does not exist" });
    return;
  }

  existingBill.notes = notes || existingBill.notes || "";
  existingBill.price = price || existingBill.price;

  await addLog(
    req.session.uid!,
    LogModule[5],
    LogType[1],
    existingBill,
  );

  await existingBill.save();

  res.status(200).send(existingBill);
};

export const recoverBill: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role === Roles.Assistant || token.role === Roles.Patient) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const paramsSchema = z
    .object({
      billId: z.string({ required_error: "Bill ID is required" }),
    })
    .refine(({ billId }) => isValidObjectId(billId), {
      message: "Invalid bill ID",
    });

  const paramsParse = paramsSchema.safeParse(req.params);

  if (!paramsParse.success) {
    res.status(400).send(paramsParse.error.flatten());
    return;
  }

  const { billId } = req.params as z.infer<typeof paramsSchema>;

  const existingBill = await Bill.findById(billId);

  if (!existingBill) {
    res.status(400).send({ message: "Bill does not exist" });
    return;
  }

  if (!existingBill.isDeleted) {
    res.status(400).send({ message: "Bill is not deleted" });
    return;
  }

  existingBill.isDeleted = false;

  await addLog(
    req.session.uid!,
    LogModule[5],
    LogType[3],
    existingBill,
  );

  await existingBill.save();

  res.status(200).send(existingBill);
};

export const removeBill: RequestHandler = async (req, res) => {
  const token = verifyToken(req.headers.authorization);

  if ("message" in token) {
    const error: ErrorMessage = { message: token.message };
    res.status(401).json(error);
    return;
  }

  if (token.role === Roles.Assistant || token.role === Roles.Patient) {
    const error: ErrorMessage = { message: "Unauthorized to do this" };
    res.status(401).json(error);
    return;
  }

  const paramsSchema = z
    .object({
      billId: z.string({ required_error: "Bill ID is required" }),
    })
    .refine(({ billId }) => isValidObjectId(billId), {
      message: "Invalid bill ID",
    });

  const paramsParse = paramsSchema.safeParse(req.params);

  if (!paramsParse.success) {
    res.status(400).send(paramsParse.error.flatten());
    return;
  }

  const { billId } = req.params as z.infer<typeof paramsSchema>;

  const existingBill = await Bill.findById(billId);

  if (!existingBill || existingBill.isDeleted) {
    res.status(400).send({ message: "Bill does not exist" });
    return;
  }

  existingBill.isDeleted = true;

  await addLog(
    req.session.uid!,
    LogModule[5],
    LogType[2],
    existingBill,
  );

  await existingBill.save();

  res.status(200).send(existingBill);
};
