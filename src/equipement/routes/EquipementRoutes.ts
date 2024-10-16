import { Router } from "express";
import { addEquipement } from "../controller/EquipementController";

const router = Router();
router.post("/", addEquipement);

export default router;
