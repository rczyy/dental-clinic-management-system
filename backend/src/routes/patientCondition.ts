import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  addPatientCondition,
  editPatientCondition,
  getPatientConditions,
  removePatientCondition,
} from "../controllers/patientCondition";

const router = Router();

router.get("/:userId", checkAuth, getPatientConditions);
router.post("/:userId", checkAuth, addPatientCondition);
router.put("/:id", checkAuth, editPatientCondition);
router.delete("/:id", checkAuth, removePatientCondition);

export default router;
