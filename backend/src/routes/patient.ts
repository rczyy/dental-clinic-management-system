import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  getDeletedPatients,
  getPatient,
  getPatientNames,
  getPatients,
  recoverPatient,
  registerPatient,
  removePatient,
} from "../controllers/patient";

const router = Router();

router
  .get("/", checkAuth, getPatients)
  .get("/names", checkAuth, getPatientNames)
  .get("/deleted", checkAuth, getDeletedPatients)
  .get("/:user", checkAuth, getPatient);
router.post("/register", registerPatient);
router.put("/recover/:user", checkAuth, recoverPatient);
router.delete("/remove/:user", checkAuth, removePatient);

export default router;
