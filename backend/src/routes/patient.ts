import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { getPatients, registerPatient } from "../controllers/patient";

const router = Router();

router.get("/", checkAuth, getPatients);
router.post("/register", registerPatient);

export default router;
