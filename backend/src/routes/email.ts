import { Router } from "express";
import { requestEmailVerification } from "../controllers/email";

const router = Router();

router.post("/verification", requestEmailVerification);

export default router;
