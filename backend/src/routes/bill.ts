import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  addBill,
  editBill,
  getBills,
  getDeletedBills,
  getPatientBills,
  recoverBill,
  removeBill,
} from "../controllers/bill";

const router = Router();

router
  .get("/", checkAuth, getBills)
  .get("/deleted", checkAuth, getDeletedBills)
  .get("/:userId", checkAuth, getPatientBills);
router.post("/", checkAuth, addBill);
router.put("/:billId", checkAuth, editBill);
router.put("/recover/:billId", checkAuth, recoverBill);
router.delete("/:billId", checkAuth, removeBill);

export default router;
