import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { getAssistants } from "../controllers/assistant";

const router = Router();

router.get("/", checkAuth, getAssistants);

export default router;
