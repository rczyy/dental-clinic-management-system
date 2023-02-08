import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { getFrontDesks } from "../controllers/frontDesk";

const router = Router();

router.get("/", checkAuth, getFrontDesks);

export default router;
