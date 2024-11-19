import { Router } from "express";
import equipementRoutes from "./routes/EquipementRoutes.js";
import locationRoutes from "./routes/LocationRoutes.js";
import snapshotRoutes from "./routes/SnapshotRoutes.js";
import cohRoutes from "./routes/COHRoutes.js";
import fuelUsedRoutes from "./routes/FuelUsedRoutes.js";
import fuelUsedLast24Routes from "./routes/FuelUsedLast24Routes.js";
import distanceRoutes from "./routes/DistanceRoutes.js";
import cihRoutes from "./routes/CIHRoutes.js";
import fuelRemainingRoutes from "./routes/FuelRemaining.js";
import defRemainingRoutes from "./routes/DEFRemaining.js";
import engineStatusRoutes from "./routes/EngineStatusRoutes.js";
import clcController from "./routes/CLCRoutes.js";
import cptController from "./routes/CPTRoutes.js";

const apiRouter = Router();

apiRouter.use("/equipos", equipementRoutes);
apiRouter.use("/localizacion", locationRoutes);
apiRouter.use("/snapshot", snapshotRoutes);
apiRouter.use("/coh", cohRoutes);
apiRouter.use("/combustibleUsado", fuelUsedRoutes);
apiRouter.use("/combustibleUsado24", fuelUsedLast24Routes);
apiRouter.use("/distancia", distanceRoutes);
apiRouter.use("/cih", cihRoutes);
apiRouter.use("/combustibleRestante", fuelRemainingRoutes);
apiRouter.use("/DEFRestante", defRemainingRoutes);
apiRouter.use("/estadoMotor", engineStatusRoutes);
apiRouter.use("/clc", clcController);
apiRouter.use("/cpt", cptController);

export default apiRouter;
