import { Router } from "express";
import { IController } from "../controller/use_cases/IController.js";
import { DEFRemainingController } from "../controller/infraestructure/DEFRemainingController.js";

const ctrl: IController = new DEFRemainingController();

const defRemainingRoutes = Router();

defRemainingRoutes.post("/", ctrl.add.bind(ctrl));
defRemainingRoutes.put("/", ctrl.update.bind(ctrl));
defRemainingRoutes.delete("/:defRemainingId", ctrl.delete.bind(ctrl));
defRemainingRoutes.get("/:defRemainingId", ctrl.get.bind(ctrl));
defRemainingRoutes.get("/", ctrl.getBy.bind(ctrl));

export default defRemainingRoutes;
