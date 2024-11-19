import { Router } from "express";
import { IController } from "../controller/use_cases/IController.js";
import { CPTController } from "../controller/infraestructure/CPTController.js";

const ctrl: IController = new CPTController();

const cptController = Router();

cptController.post("/", ctrl.add.bind(ctrl));
cptController.put("/", ctrl.update.bind(ctrl));
cptController.delete("/:id", ctrl.delete.bind(ctrl));
cptController.get("/:id", ctrl.get.bind(ctrl));
cptController.get("/", ctrl.getBy.bind(ctrl));

export default cptController;
