import { Router } from "express";
import DatabaseBackup from "../controller/infraestructure/BackupsController.js";

const ctrl = new DatabaseBackup();
const backupRoutes = Router();
backupRoutes.post("/", ctrl.createBackup.bind(ctrl));
backupRoutes.put("/", ctrl.restoreBackup.bind(ctrl));
backupRoutes.get("/", ctrl.getBackupFiles.bind(ctrl));

export default backupRoutes;
