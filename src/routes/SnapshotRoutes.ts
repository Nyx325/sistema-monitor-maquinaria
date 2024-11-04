import { Router } from "express";
import {
  addSnapshot,
  getSnapshotBy,
  updateSnapshot,
} from "../controller/infraestructure/SnapshotController.js";

const snapshotRoutes = Router();
snapshotRoutes.get("/", getSnapshotBy);
snapshotRoutes.post("/", addSnapshot);
snapshotRoutes.put("/", updateSnapshot);

export default snapshotRoutes;
