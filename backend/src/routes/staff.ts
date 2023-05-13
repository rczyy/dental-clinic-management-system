import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  changePasswordNewStaff,
  getStaff,
  getStaffs,
  registerStaff,
  removeStaff,
} from "../controllers/staff";

const router = Router();

router.get("/", checkAuth, getStaffs).get("/:user", checkAuth, getStaff);
router.post("/register", checkAuth, registerStaff);
router.put("/change-password", changePasswordNewStaff);
router.delete("/remove/:user", checkAuth, removeStaff);

export default router;
