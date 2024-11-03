import { Router } from "express";
import equipementRoutes from "./routes/EquipementRoutes.js";
import locationRoutes from "./routes/LocationRoutes.js";

const apiRouter = Router();

apiRouter.use("/equipos", equipementRoutes);
apiRouter.use("/localizacion", locationRoutes);

export default apiRouter;
