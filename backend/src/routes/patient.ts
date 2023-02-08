import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  getPatient,
  getPatients,
  registerPatient,
} from "../controllers/patient";

const router = Router();

router.get("/", checkAuth, getPatients).get("/:userId", checkAuth, getPatient);
router.post("/register", registerPatient);

export default router;
