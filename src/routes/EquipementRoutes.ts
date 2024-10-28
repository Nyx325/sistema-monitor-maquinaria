import { Router } from "express";
import {
  addEquipement,
  deleteEquipement,
  getEquipement,
  getEquipementBy,
  updateEquipement,
} from "../controller/infraestructure/EquipementController.js";

const equipementRoutes = Router();
equipementRoutes.post("/", addEquipement);
equipementRoutes.get("/", getEquipementBy);
equipementRoutes.delete("/:serialNumber", deleteEquipement);
equipementRoutes.get("/:serialNumber", getEquipement);
equipementRoutes.put("/", updateEquipement);

export default equipementRoutes;
