import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { getStaffs, registerStaff } from "../controllers/staff";

const router = Router();

router.get("/", checkAuth, getStaffs);
router.post("/register", checkAuth, registerStaff);

export default router;
