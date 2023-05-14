import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { addAppointment, getAppointments } from "../controllers/appointment";

const router = Router();

router.get("/", checkAuth, getAppointments);
router.post("/add", checkAuth, addAppointment);

export default router;