import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { addBill, editBill, getBills, removeBill } from "../controllers/bill";

const router = Router();

router.get("/", checkAuth, getBills);
router.post("/", checkAuth, addBill);
router.put("/:billId", checkAuth, editBill);
router.delete("/:billId", checkAuth, removeBill);

export default router;
