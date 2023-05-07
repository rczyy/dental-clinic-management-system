import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  getMe,
  getUsers,
  loginUser,
  logoutUser,
  verifyUser,
} from "../controllers/user";

const router = Router();

router.get("/", checkAuth, getUsers).get("/me", getMe);
router.post("/login", loginUser);
router.put("/verify", verifyUser);
router.delete("/logout", checkAuth, logoutUser);

export default router;
