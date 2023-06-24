import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import userRoute from "./routes/user";
import adminRoute from "./routes/admin";
import assistantRoute from "./routes/assistant";
import dentistRoute from "./routes/dentist";
import frontDeskRoute from "./routes/frontDesk";
import managerRoute from "./routes/manager";
import patientRoute from "./routes/patient";
import staffRoute from "./routes/staff";
import serviceRoute from "./routes/service";
import emailRoute from "./routes/email";
import oauthRoute from "./routes/oauth";
import appointmentRoute from "./routes/appointment";
import attendanceRoute from "./routes/attendance";
import dentistScheduleRoute from "./routes/dentistSchedule";
import log from "./routes/log";
import notificationRoute from "./routes/notification";
import billRoute from "./routes/bill";
import patientCondition from "./routes/patientCondition";
import prescription from "./routes/prescription";
import patientFile from "./routes/patientFile";

const main = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.MONGO_URI);

  const app = express();
  const port = process.env.PORT || 5000;

  app.use(
    cors({
      origin: ["http://localhost:5173", "https://atdentalhome.vercel.app"],
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  app.use(
    session({
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
      secret: process.env.SESSION_SECRET,
      name: "uid",
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === "production",
      },
    })
  );

  app.use("/user", userRoute);
  app.use("/admin", adminRoute);
  app.use("/assistant", assistantRoute);
  app.use("/dentist", dentistRoute);
  app.use("/frontDesk", frontDeskRoute);
  app.use("/manager", managerRoute);
  app.use("/patient", patientRoute);
  app.use("/staff", staffRoute);
  app.use("/service", serviceRoute);
  app.use("/email", emailRoute);
  app.use("/oauth", oauthRoute);
  app.use("/appointment", appointmentRoute);
  app.use("/attendance", attendanceRoute);
  app.use("/dentist-schedule", dentistScheduleRoute);
  app.use("/log", log);
  app.use("/notification", notificationRoute);
  app.use("/bill", billRoute);
  app.use("/patient-condition", patientCondition);
  app.use("/prescription", prescription);
  app.use("/patient-file", patientFile);

  app.listen(port, () => console.log(`Server listening to http://localhost:${port}`));
};

main();
