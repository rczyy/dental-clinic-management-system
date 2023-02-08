import { RequestHandler } from "express";
import User from "../models/user";
import Staff from "../models/staff";
import Manager from "../models/manager";
import Assistant from "../models/assistant";
import Dentist from "../models/dentist";
import FrontDesk from "../models/frontDesk";
import { z } from "zod";
import { hash } from "bcrypt";

export const getStaffs: RequestHandler = async (_, res) => {
    const staffs = await Staff.find();

    res.status(200).json(staffs);
};

export const registerStaff: RequestHandler = async (req, res) => {
    enum StaffList {
        Manager = "Manager",
        Assistant = "Assistant",
        Dentist = "Dentist",
        FrontDesk = "Front Desk",
    }
    const userSchema = z
        .object({
            firstName: z.string({ required_error: "First name is required" }),
            middleName: z.string({ required_error: "Middle name is required" }),
            lastName: z.string({ required_error: "Last name is required" }),
            region: z.string({ required_error: "Region is required" }),
            province: z.string({ required_error: "Province is required" }),
            city: z.string({ required_error: "City is required" }),
            barangay: z.string({ required_error: "Barangay is required" }),
            street: z.string({ required_error: "Street is required" }),
            email: z.string({ required_error: "Email is required" }).email(),
            password: z
                .string({ required_error: "Password is required" })
                .min(6, "Password must be atleast 6 characters"),
            confirmPassword: z.string({
                required_error: "Confirm your password",
            }),
            contactNo: z.union([
                z
                    .string({ required_error: "Invalid contact number" })
                    .startsWith("+63", "Invalid contact number")
                    .length(13, "Invalid contact number"),
                z
                    .string({ required_error: "Invalid contact number" })
                    .startsWith("09", "Invalid contact number")
                    .length(11, "Invalid contact number"),
            ]),
            role: z.nativeEnum(StaffList),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Passwords doesn't match",
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
        password,
        contactNo,
        role,
    }: body = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error: ErrorBody = {
            formErrors: ["User already exists"],
        };

        res.status(400).json(error);
        return;
    }

    const hashedPassword = await hash(password, 10);

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
        password: hashedPassword,
        contactNo,
        role,
    });

    const staff = new Staff({
        userId: user._id,
    });

    await user.save();
    await staff.save();

    if (role === StaffList.Manager) {
        const manager = new Manager({
            staffId: staff._id,
        });
        await manager.save();
    }
    if (role === StaffList.Assistant) {
        const assistant = new Assistant({
            staffId: staff._id,
        });
        await assistant.save();
    }
    if (role === StaffList.Dentist) {
        const dentist = new Dentist({
            staffId: staff._id,
        });
        await dentist.save();
    }
    if (role === StaffList.FrontDesk) {
        const frontDesk = new FrontDesk({
            staffId: staff._id,
        });
        await frontDesk.save();
    }
    res.status(201).json(user);
};
