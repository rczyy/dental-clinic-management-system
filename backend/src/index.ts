import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/user";

const main = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.MONGO_URI as string);

  const app = express();
  const port = process.env.PORT || 5000;

  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/user", userRoute);

  app.listen(port, () =>
    console.log(`Server listening to http://localhost:${port}`)
  );
};

main();
