import { Router } from "express";
import { getUsers } from "../controllers/user";

const router = Router();

router.get("/", getUsers);

export default router;
