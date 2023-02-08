import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  getStaff,
  getStaffs,
  registerStaff,
  removeStaff,
} from "../controllers/staff";

const router = Router();

router.get("/", checkAuth, getStaffs).get("/:userId", checkAuth, getStaff);
router.post("/register", checkAuth, registerStaff);
router.delete("/remove/:userId", checkAuth, removeStaff);

export default router;
