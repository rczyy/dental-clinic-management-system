import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  editDentistSchedule,
  getDentistSchedule,
} from "../controllers/dentistSchedule";

const router = Router();

router.get("/", checkAuth, getDentistSchedule);
router.put("/", checkAuth, editDentistSchedule);

export default router;
