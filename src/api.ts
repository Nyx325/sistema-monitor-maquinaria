import { Router } from "express";
import equipementRoutes from "./routes/EquipementRoutes.js";
import locationRoutes from "./routes/LocationRoutes.js";
import snapshotRoutes from "./routes/SnapshotRoutes.js";
import cohRoutes from "./routes/COHRoutes.js";

const apiRouter = Router();

apiRouter.use("/equipos", equipementRoutes);
apiRouter.use("/localizacion", locationRoutes);
apiRouter.use("/snapshot", snapshotRoutes);
apiRouter.use("/coh", cohRoutes);

export default apiRouter;
