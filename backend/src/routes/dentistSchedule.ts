import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  addDentistSchedule,
  deleteDentistSchedule,
  getDentistSchedule,
} from "../controllers/dentistSchedule";

const router = Router();

router.get("/:dentist", checkAuth, getDentistSchedule);
router.post("/", checkAuth, addDentistSchedule);
router.delete("/", checkAuth, deleteDentistSchedule);

export default router;
