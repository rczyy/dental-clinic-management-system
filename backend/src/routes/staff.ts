import { Router } from "express";
import { getStaffs } from "../controllers/staff";

const router = Router();

router.get("/", getStaffs);

export default router;
