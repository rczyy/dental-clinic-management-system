import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { getLogs } from "../controllers/log";

const router = Router();

router.get("/", checkAuth, getLogs);

export default router;
