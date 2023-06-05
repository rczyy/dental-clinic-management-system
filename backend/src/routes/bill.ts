import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  addBill,
  editBill,
  getBills,
  getDeletedBills,
  removeBill,
} from "../controllers/bill";

const router = Router();

router
  .get("/", checkAuth, getBills)
  .get("/deleted", checkAuth, getDeletedBills);
router.post("/", checkAuth, addBill);
router.put("/:billId", checkAuth, editBill);
router.delete("/:billId", checkAuth, removeBill);

export default router;
