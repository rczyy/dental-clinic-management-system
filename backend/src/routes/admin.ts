import { Router } from "express";
import { getAdmins, registerAdmin } from "../controllers/admin";

const router = Router();

router.get("/", getAdmins);
router.post("/register", registerAdmin);

export default router;
