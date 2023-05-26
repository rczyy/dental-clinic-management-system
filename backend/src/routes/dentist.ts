import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { getDentists, getDentistNames } from "../controllers/dentist";

const router = Router();

router.get("/", checkAuth, getDentists).get("/names", checkAuth, getDentistNames);

export default router;
