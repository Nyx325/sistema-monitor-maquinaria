import { Router } from "express";
import {
  addEquipement,
  deleteEquipement,
  getEquipement,
  updateEquipement,
} from "../controller/EquipementController";

const router = Router();
router.post("/", addEquipement);
router.get("/", getEquipement);
router.delete("/:serialNumber", deleteEquipement);
router.put("/", updateEquipement);

export default router;
