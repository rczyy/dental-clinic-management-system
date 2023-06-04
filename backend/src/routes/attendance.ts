import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  getAttendance,
  getMyAttendance,
  editAttendance,
  removeAttendance,
  logTimeIn,
  logTimeOut,
  getAttendanceToday,
} from "../controllers/attendance";

const router = Router();

router
  .get("/", checkAuth, getAttendance)
  .get("/today", checkAuth, getAttendanceToday)
  .get("/me", checkAuth, getMyAttendance);
router
  .post("/time-in", checkAuth, logTimeIn)
  .post("/time-out", checkAuth, logTimeOut);
  router.patch("/edit/:attendanceID", checkAuth, editAttendance);
router.delete("/remove/:attendanceID", checkAuth, removeAttendance);

export default router;
