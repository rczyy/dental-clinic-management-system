import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  getPatient,
  getPatients,
  registerPatient,
  removePatient,
} from "../controllers/patient";

const router = Router();

router.get("/", checkAuth, getPatients).get("/:userId", checkAuth, getPatient);
router.post("/register", registerPatient);
router.delete("/remove/:userId", checkAuth, removePatient);

export default router;
