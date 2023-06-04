import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  getDeletedStaffs,
  getStaff,
  getStaffs,
  recoverStaff,
  registerStaff,
  removeStaff,
} from "../controllers/staff";

const router = Router();

router
  .get("/", checkAuth, getStaffs)
  .get("/deleted", checkAuth, getDeletedStaffs)
  .get("/:user", checkAuth, getStaff);
router.post("/register", checkAuth, registerStaff);
router.put("/recover/:user", checkAuth, recoverStaff);
router.delete("/remove/:user", checkAuth, removeStaff);

export default router;
