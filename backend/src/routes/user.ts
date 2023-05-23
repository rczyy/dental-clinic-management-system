import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  editUser,
  getMe,
  getUsers,
  loginUser,
  logoutUser,
  resetPasswordUser,
  verifyUser,
} from "../controllers/user";
import upload from "multer";

const router = Router();

router.get("/", checkAuth, getUsers).get("/me", getMe);
router.post("/login", loginUser);
router.put("/edit/:id", checkAuth, upload().single("avatar"), editUser);
router.put("/verify", verifyUser);
router.put("/reset-password", resetPasswordUser);
router.delete("/logout", checkAuth, logoutUser);

export default router;
