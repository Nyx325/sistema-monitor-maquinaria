import { Router } from "express";
import { EngineStatusController } from "../controller/infraestructure/EngineStatusController.js";

const ctrl = new EngineStatusController();
const engineStatusRoutes = Router();
engineStatusRoutes.post("/", ctrl.add.bind(ctrl));
engineStatusRoutes.put("/", ctrl.update.bind(ctrl));
engineStatusRoutes.get("/", ctrl.getBy.bind(ctrl));
engineStatusRoutes.delete("/:engineStatusId", ctrl.delete.bind(ctrl));
engineStatusRoutes.get("/:engineStatusId", ctrl.get.bind(ctrl));

export default engineStatusRoutes;
