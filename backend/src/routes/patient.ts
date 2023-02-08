import { Router } from "express";
import { getPatients, registerPatient } from "../controllers/patient";

const router = Router();

router.get("/", getPatients);
router.post("/register", registerPatient);

export default router;
