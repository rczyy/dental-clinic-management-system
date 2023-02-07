import { Router } from "express";
import { getManagers } from "../controllers/manager";

const router = Router();

router.get("/", getManagers);

export default router;
