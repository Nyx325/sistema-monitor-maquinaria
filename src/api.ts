import { Router } from "express";
import equipementRoutes from "./equipement/routes/EquipementRoutes.js";

const apiRouter = Router();

apiRouter.use("/equipos", equipementRoutes);

export default apiRouter;
