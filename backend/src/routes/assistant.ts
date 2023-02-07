import { Router } from "express";
import { getAssistants } from "../controllers/assistant";

const router = Router();

router.get("/", getAssistants);

export default router;
