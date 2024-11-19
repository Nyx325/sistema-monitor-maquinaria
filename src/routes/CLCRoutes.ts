import { Router } from "express";
import { IController } from "../controller/use_cases/IController.js";
import { CLCController } from "../controller/infraestructure/CLCController.js";

const ctrl: IController = new CLCController();

const clcController = Router();

clcController.post("/", ctrl.add.bind(ctrl));
clcController.put("/", ctrl.update.bind(ctrl));
clcController.delete("/:id", ctrl.delete.bind(ctrl));
clcController.get("/:id", ctrl.get.bind(ctrl));
clcController.get("/", ctrl.getBy.bind(ctrl));

export default clcController;
