import { Router } from "express";
import { IController } from "../controller/use_cases/IController.js";
import { FaultCodeController } from "../controller/infraestructure/FaultCodeController.js";

const ctrl: IController = new FaultCodeController();

const faultCodeController = Router();

faultCodeController.post("/", ctrl.add.bind(ctrl));
faultCodeController.put("/", ctrl.update.bind(ctrl));
faultCodeController.delete("/:id", ctrl.delete.bind(ctrl));
faultCodeController.get("/:id", ctrl.get.bind(ctrl));
faultCodeController.get("/", ctrl.getBy.bind(ctrl));

export default faultCodeController;
