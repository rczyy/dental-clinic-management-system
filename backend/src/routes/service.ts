import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import {
  getServices,
  addService,
  removeService,
  editService,
  getService,
  getServiceCategory,
} from "../controllers/service";

const router = Router();

router
  .get("/", checkAuth, getServices)
  .get("/categories", checkAuth, getServiceCategory)
  .get("/:serviceId", checkAuth, getService);
router.post("/add", checkAuth, addService);
router.patch("/edit/:serviceId", checkAuth, editService);
router.delete("/remove/:serviceId", checkAuth, removeService);

export default router;
