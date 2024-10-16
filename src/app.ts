import express from "express";
import equipementRoutes from "./equipement/routes/EquipementRoutes";

const app = express();
app.use(express.json());
app.use("/equipos", equipementRoutes);

export default app;
