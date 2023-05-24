import { Router } from "express";
import {
  requestEmailVerification,
  requestResetPassword,
} from "../controllers/email";

const router = Router();

router.post("/verification", requestEmailVerification);
router.post("/reset-password", requestResetPassword);

export default router;
