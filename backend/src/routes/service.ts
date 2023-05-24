import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  getServices,
  addService,
  removeService,
  editService,
  getService,
} from "../controllers/service";

const router = Router();

router
  .get("/", getServices)
  .get("/:service", getService);
router.post("/add", checkAuth, addService);
router.patch("/edit/:service", checkAuth, editService);
router.delete("/remove/:service", checkAuth, removeService);

export default router;
