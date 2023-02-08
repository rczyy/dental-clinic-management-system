import { Router } from "express";
import { getMe, getUsers, loginUser } from "../controllers/user";

const router = Router();

router.get("/", getUsers).get("/me", getMe);
router.post("/login", loginUser);

export default router;
