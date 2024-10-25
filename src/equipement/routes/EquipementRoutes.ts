import { Router } from "express";
import {
  addEquipement,
  deleteEquipement,
  getEquipement,
  updateEquipement,
} from "../controller/EquipementController.js";

const equipementRoutes = Router();
equipementRoutes.post("/", addEquipement);
equipementRoutes.get("/", getEquipement);
equipementRoutes.delete("/:serialNumber", deleteEquipement);
equipementRoutes.put("/", updateEquipement);

export default equipementRoutes;
