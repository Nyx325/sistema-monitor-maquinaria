import { Router } from "express";
import {
  addSnapshot,
  updateSnapshot,
} from "../controller/infraestructure/SnapshotController.js";

const snapshotRoutes = Router();
snapshotRoutes.post("/", addSnapshot);
snapshotRoutes.put("/", updateSnapshot);

export default snapshotRoutes;
