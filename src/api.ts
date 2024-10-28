import { Router } from "express";
import equipementRoutes from "./routes/EquipementRoutes.js";

const apiRouter = Router();

apiRouter.use("/equipos", equipementRoutes);

export default apiRouter;
