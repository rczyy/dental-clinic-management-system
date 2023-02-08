import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { getManagers } from "../controllers/manager";

const router = Router();

router.get("/", checkAuth, getManagers);

export default router;
