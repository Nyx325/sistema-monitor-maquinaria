import { Router } from "express";
import { CIHController } from "../controller/infraestructure/CIHController.js";

const ctrl = new CIHController();
const cihRoutes = Router();
cihRoutes.post("/", ctrl.add.bind(ctrl));
cihRoutes.put("/", ctrl.update.bind(ctrl));
cihRoutes.get("/", ctrl.getBy.bind(ctrl));
cihRoutes.delete("/:cihId", ctrl.delete.bind(ctrl));
cihRoutes.get("/:cihId", ctrl.get.bind(ctrl));

export default cihRoutes;
