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
import appointmentRoute from "./routes/appointment"

const main = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.MONGO_URI);

  const app = express();
  const port = process.env.PORT || 5000;

  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

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
  app.use("/appointment", appointmentRoute);

  app.listen(port, () =>
    console.log(`Server listening to http://localhost:${port}`)
  );
};

main();
