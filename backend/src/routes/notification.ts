import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  getNotifications,
  addNotification,
  readNotifications,
} from "../controllers/notification";

const router = Router();

router.get("/", checkAuth, getNotifications);
router.post("/", checkAuth, addNotification);
router.put("/read", checkAuth, readNotifications);

export default router;
