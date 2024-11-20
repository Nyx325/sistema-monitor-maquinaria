import { Router } from "express";
import { IController } from "../controller/use_cases/IController.js";
import { UserController } from "../controller/infraestructure/UserController.js";

const ctrl: IController = new UserController();

const clcController = Router();

clcController.post("/", ctrl.add.bind(ctrl));
clcController.put("/", ctrl.update.bind(ctrl));
clcController.delete("/:id", ctrl.delete.bind(ctrl));
clcController.get("/:id", ctrl.get.bind(ctrl));
clcController.get("/", ctrl.getBy.bind(ctrl));

export default clcController;
