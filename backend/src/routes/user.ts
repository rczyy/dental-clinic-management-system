import { Router } from "express";
import { getMe, getUsers, loginUser, logoutUser } from "../controllers/user";

const router = Router();

router.get("/", getUsers).get("/me", getMe);
router.post("/login", loginUser);
router.delete("/logout", logoutUser);

export default router;
