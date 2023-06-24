import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  banPatient,
  getBannedPatients,
  getDeletedPatients,
  getPatient,
  getPatientNames,
  getPatients,
  recoverPatient,
  registerPatient,
  removePatient,
  unbanPatient,
} from "../controllers/patient";

const router = Router();

router
  .get("/", checkAuth, getPatients)
  .get("/names", checkAuth, getPatientNames)
  .get("/deleted", checkAuth, getDeletedPatients)
  .get("/banned", checkAuth, getBannedPatients)
  .get("/:user", checkAuth, getPatient);
router.post("/register", registerPatient);
router
  .put("/recover/:user", checkAuth, recoverPatient)
  .put("/ban/:patient", checkAuth, banPatient)
  .put("/unban/:patient", checkAuth, unbanPatient);
router.delete("/remove/:user", checkAuth, removePatient);

export default router;
