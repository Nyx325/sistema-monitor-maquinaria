import { Router } from "express";
import { addCOH } from "../controller/infraestructure/COHController.js";

const cohRoutes = Router();
cohRoutes.post("/", addCOH);

export default cohRoutes;
