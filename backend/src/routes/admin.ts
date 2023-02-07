import { Router } from "express";
import { getAdmins } from "../controllers/admin";

const router = Router();

router.get("/", getAdmins);

export default router;
