import { Router } from "express";
import { addLocation } from "../controller/infraestructure/LocationController.js";

const locationRoutes = Router();
locationRoutes.post("/", addLocation);

export default locationRoutes;
