import { Router } from "express";
import {
  addLocation,
  updateLocation,
} from "../controller/infraestructure/LocationController.js";

const locationRoutes = Router();
locationRoutes.post("/", addLocation);
locationRoutes.put("/", updateLocation);

export default locationRoutes;
