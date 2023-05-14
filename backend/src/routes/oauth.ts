import { Router } from "express";
import { loginWithGoogle } from "../controllers/oauth";

const router = Router();

router.post("/google", loginWithGoogle);

export default router;
