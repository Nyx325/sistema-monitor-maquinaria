import { Router } from "express";
import { IController } from "../controller/use_cases/IController.js";
import { FuelRemainingController } from "../controller/infraestructure/FuelRemainingController.js";

const ctrl: IController = new FuelRemainingController();

const fuelRemainingRoutes = Router();

fuelRemainingRoutes.post("/", ctrl.add.bind(ctrl));
fuelRemainingRoutes.put("/", ctrl.update.bind(ctrl));
fuelRemainingRoutes.delete("/:fuelRemainingId", ctrl.delete.bind(ctrl));
fuelRemainingRoutes.get("/:fuelRemainingId", ctrl.get.bind(ctrl));
fuelRemainingRoutes.get("/", ctrl.getBy.bind(ctrl));

export default fuelRemainingRoutes;
