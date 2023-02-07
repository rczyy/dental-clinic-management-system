import { Router } from "express";
import { getPatients } from "../controllers/patient";

const router = Router();

router.get("/", getPatients);

export default router;
