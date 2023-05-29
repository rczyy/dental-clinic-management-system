import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { getAttendance, logTimeIn, logTimeOut } from "../controllers/attendance";

const router = Router();

router.get("/", checkAuth, getAttendance);
router.post("/time-in", checkAuth, logTimeIn);
router.post("/time-out", checkAuth, logTimeOut);

export default router;
