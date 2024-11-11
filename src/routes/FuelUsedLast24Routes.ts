import { Router } from "express";

import { FuelUsedLast24Controller } from "../controller/infraestructure/FuelUsedLast24Controller.js";
import { IController } from "../controller/use_cases/IController.js";

const ctrl: IController = new FuelUsedLast24Controller();

const fuelUsedLast24Routes = Router();

// Definición de rutas usando los métodos del controlador
// El uso de bind en cada método (ctrl.add.bind(ctrl))
// garantiza que la referencia al contexto this en cada
// método del controlador se mantenga.
fuelUsedLast24Routes.post("/", ctrl.add.bind(ctrl));
fuelUsedLast24Routes.put("/", ctrl.update.bind(ctrl));
fuelUsedLast24Routes.delete("/:fuelUsedId", ctrl.delete.bind(ctrl));
fuelUsedLast24Routes.get("/:fuelUsedId", ctrl.get.bind(ctrl));
fuelUsedLast24Routes.get("/", ctrl.getBy.bind(ctrl));

export default fuelUsedLast24Routes;
