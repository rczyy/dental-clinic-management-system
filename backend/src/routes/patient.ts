import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  getPatient,
  getPatientNames,
  getPatients,
  registerPatient,
  removePatient,
} from "../controllers/patient";

const router = Router();

router
  .get("/", checkAuth, getPatients)
  .get("/names", checkAuth, getPatientNames)
  .get("/:user", checkAuth, getPatient);
router.post("/register", registerPatient);
router.delete("/remove/:user", checkAuth, removePatient);

export default router;
