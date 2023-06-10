import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  getPrescriptions,
  addPrescription,
  editPrescription,
  removePrescription,
} from "../controllers/prescription";

const router = Router();

router.get("/:userId", checkAuth, getPrescriptions);
router.post("/:userId", checkAuth, addPrescription);
router.put("/:id", checkAuth, editPrescription);
router.delete("/:id", checkAuth, removePrescription);

export default router;
