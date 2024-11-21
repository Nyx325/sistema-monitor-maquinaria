import { Router } from "express";
import { UserController } from "../controller/infraestructure/UserController.js";

const ctrl = new UserController();

const authRouter = Router();

authRouter.post("/", ctrl.auth.bind(ctrl));

export default authRouter;
