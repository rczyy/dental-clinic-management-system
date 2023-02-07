import { Router } from "express";
import { getDentists } from "../controllers/dentist";

const router = Router();

router.get("/", getDentists);

export default router;
