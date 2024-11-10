import { Router } from "express";
import equipementRoutes from "./routes/EquipementRoutes.js";
import locationRoutes from "./routes/LocationRoutes.js";
import snapshotRoutes from "./routes/SnapshotRoutes.js";
import cohRoutes from "./routes/COHRoutes.js";
import fuelUsedRoutes from "./routes/FuelUsedRoutes.js";
import fuelUsedLast24Routes from "./routes/FuelUsedLast24Routes.js";

const apiRouter = Router();

apiRouter.use("/equipos", equipementRoutes);
apiRouter.use("/localizacion", locationRoutes);
apiRouter.use("/snapshot", snapshotRoutes);
apiRouter.use("/coh", cohRoutes);
apiRouter.use("/combustibleUsado", fuelUsedRoutes);
apiRouter.use("/combustibleUsado24", fuelUsedLast24Routes);

export default apiRouter;
