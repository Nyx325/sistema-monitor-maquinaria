import { Router } from "express";
import {
  addSnapshot,
  deleteSnapshot,
  getSnapshotBy,
  updateSnapshot,
  getSnapshot,
} from "../controller/infraestructure/SnapshotController.js";

const snapshotRoutes = Router();
snapshotRoutes.get("/", getSnapshotBy);
snapshotRoutes.post("/", addSnapshot);
snapshotRoutes.put("/", updateSnapshot);
snapshotRoutes.delete("/:snapshotId", deleteSnapshot);
snapshotRoutes.get("/:snapshotId", getSnapshot);

export default snapshotRoutes;
