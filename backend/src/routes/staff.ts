import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { getStaff, getStaffs, registerStaff } from "../controllers/staff";

const router = Router();

router.get("/", checkAuth, getStaffs).get("/:userId", checkAuth, getStaff);
router.post("/register", checkAuth, registerStaff);

export default router;
