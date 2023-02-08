import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { getDentists } from "../controllers/dentist";

const router = Router();

router.get("/", checkAuth, getDentists);

export default router;
