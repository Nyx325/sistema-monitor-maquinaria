import { Router } from "express";

import { FuelUsedController } from "../controller/infraestructure/FuelUsedController.js";
import { IController } from "../controller/use_cases/IController.js";

const ctrl: IController = new FuelUsedController();

const fuelUsedRoutes = Router();

// Definición de rutas usando los métodos del controlador
// El uso de bind en cada método (ctrl.add.bind(ctrl))
// garantiza que la referencia al contexto this en cada
// método del controlador se mantenga.
fuelUsedRoutes.post("/", ctrl.add.bind(ctrl));
fuelUsedRoutes.put("/", ctrl.update.bind(ctrl));
fuelUsedRoutes.delete("/:fuelUsedId", ctrl.delete.bind(ctrl));
fuelUsedRoutes.get("/:fuelUsedId", ctrl.get.bind(ctrl));
fuelUsedRoutes.get("/", ctrl.getBy.bind(ctrl));

export default fuelUsedRoutes;
