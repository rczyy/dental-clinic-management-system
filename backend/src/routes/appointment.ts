import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  addAppointment,
  editAppointment,
  getAppointments,
  getDentistAppointments,
  getPatientAppointments,
} from "../controllers/appointment";

const router = Router();

router
  .get("/", checkAuth, getAppointments)
  .get("/get-dentist-appointments/:dentist", checkAuth, getDentistAppointments)
  .get("/get-patient-appointments/:patient", checkAuth, getPatientAppointments);
router.post("/add", checkAuth, addAppointment);
router.put("/edit/:appointmentId", checkAuth, editAppointment);

export default router;
