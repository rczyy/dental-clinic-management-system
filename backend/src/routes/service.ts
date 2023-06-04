import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  getServices,
  addService,
  removeService,
  editService,
  getService,
  getDeletedServices,
  recoverService,
} from "../controllers/service";

const router = Router();

router
  .get("/", getServices)
  .get("/deleted", checkAuth, getDeletedServices)
  .get("/:service", getService);
router.post("/add", checkAuth, addService);
router.patch("/edit/:service", checkAuth, editService);
router.put("/recover/:service", checkAuth, recoverService);
router.delete("/remove/:service", checkAuth, removeService);

export default router;
