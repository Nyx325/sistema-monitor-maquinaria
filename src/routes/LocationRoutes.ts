import { Router } from "express";
import {
  addLocation,
  deleteLocation,
  getLocation,
  getLocationBy,
  updateLocation,
} from "../controller/infraestructure/LocationController.js";

const locationRoutes = Router();
locationRoutes.post("/", addLocation);
locationRoutes.put("/", updateLocation);
locationRoutes.get("/", getLocationBy);
locationRoutes.delete("/:locationId", deleteLocation);
locationRoutes.get("/:locationId", getLocation);

export default locationRoutes;
