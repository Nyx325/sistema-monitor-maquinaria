import { Router } from "express";
import { UserController } from "../controller/infraestructure/UserController.js";
import { IController } from "../controller/use_cases/IController.js";

const ctrl: IController = new UserController();

const usersController = Router();

usersController.post("/", ctrl.add.bind(ctrl));
usersController.put("/", ctrl.update.bind(ctrl));
usersController.delete("/:id", ctrl.delete.bind(ctrl));
usersController.get("/:id", ctrl.get.bind(ctrl));
usersController.get("/", ctrl.getBy.bind(ctrl));

export default usersController;
