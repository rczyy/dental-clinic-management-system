import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  addAppointment,
  editAppointment,
  finishAppointment,
  getAppointments,
  getDentistAppointments,
  getPatientAppointments,
  removeAppointment,
} from "../controllers/appointment";

const router = Router();

router
  .get("/", checkAuth, getAppointments)
  .get("/get-dentist-appointments/:dentist", checkAuth, getDentistAppointments)
  .get("/get-patient-appointments/:patient", checkAuth, getPatientAppointments);
router.post("/add", checkAuth, addAppointment);
router.put("/edit/:appointmentId", checkAuth, editAppointment);
router.put("/finish/:appointmentId", checkAuth, finishAppointment);
router.delete("/remove/:appointmentId", checkAuth, removeAppointment);

export default router;
