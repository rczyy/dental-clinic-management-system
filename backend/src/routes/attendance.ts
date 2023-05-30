import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  getAttendance,
  getMyAttendance,
  logTimeIn,
  logTimeOut,
} from "../controllers/attendance";

const router = Router();

router
  .get("/", checkAuth, getAttendance)
  .get("/me", checkAuth, getMyAttendance);
router
  .post("/time-in", checkAuth, logTimeIn)
  .post("/time-out", checkAuth, logTimeOut);

export default router;
