import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { getAdmins, registerAdmin } from "../controllers/admin";

const router = Router();

router.get("/", checkAuth, getAdmins);
router.post("/register", registerAdmin);

export default router;
