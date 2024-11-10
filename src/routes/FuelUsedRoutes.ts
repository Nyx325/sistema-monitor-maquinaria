import { Router } from "express";
import {
  addFuelUsed,
  updateFuelUsed,
  deleteFuelUsed,
  getFuelUsed,
  getFuelUsedBy,
} from "../controller/infraestructure/FuelUsedController.js";

const fuelUsedRoutes = Router();
fuelUsedRoutes.post("/", addFuelUsed);
fuelUsedRoutes.put("/", updateFuelUsed);
fuelUsedRoutes.delete("/:fuelUsedId", deleteFuelUsed);
fuelUsedRoutes.get("/:fuelUsedId", getFuelUsed);
fuelUsedRoutes.get("/", getFuelUsedBy);

export default fuelUsedRoutes;
