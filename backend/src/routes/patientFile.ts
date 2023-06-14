import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { addPatientFile, getPatientFiles, removePatientFile } from "../controllers/patientFile";
import multer from "multer";

const router = Router();
const upload = multer();

router.get("/:userId", checkAuth, getPatientFiles);
router.post("/:userId", checkAuth, upload.array("file"), addPatientFile);
router.delete("/:id", checkAuth, removePatientFile);

export default router;
