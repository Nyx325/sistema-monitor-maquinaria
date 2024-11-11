import { Router } from "express";
import { DistanceController } from "../controller/infraestructure/DistanceController.js";

const ctrl = new DistanceController();
const distanceRoutes = Router();
distanceRoutes.post("/", ctrl.add.bind(ctrl));
distanceRoutes.put("/", ctrl.update.bind(ctrl));
distanceRoutes.get("/", ctrl.getBy.bind(ctrl));
distanceRoutes.delete("/:distanceId", ctrl.delete.bind(ctrl));
distanceRoutes.get("/:distanceId", ctrl.get.bind(ctrl));

export default distanceRoutes;
