import { Router } from "express";
import { getFrontDesks } from "../controllers/frontDesk";

const router = Router();

router.get("/", getFrontDesks);

export default router;
