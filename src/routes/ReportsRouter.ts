import { Router } from "express";
import { ReportController } from "../controller/infraestructure/ReportController.js";

const ctrl = new ReportController();

const reportController = Router();

reportController.get("/1", ctrl.reporte1.bind(ctrl));
reportController.get("/2", ctrl.reporte2.bind(ctrl));
reportController.get("/3", ctrl.reporte3.bind(ctrl));
reportController.get("/4", ctrl.reporte4.bind(ctrl));
reportController.get("/5", ctrl.reporte5.bind(ctrl));

export default reportController;
