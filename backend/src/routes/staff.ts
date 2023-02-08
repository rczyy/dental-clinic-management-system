import { Router } from "express";
import { getStaffs, registerStaff } from "../controllers/staff";

const router = Router();

router.get("/", getStaffs);
router.post("/register", registerStaff);

export default router;