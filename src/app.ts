import express from "express";
import equipementRoutes from "./equipement/routes/EquipementRoutes";
import path from "path";

const app = express();
app.use(express.json());
app.use("/equipos", equipementRoutes);

app.get("/app", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/index.html"));
});

app.get("/app/menu", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/menu.html"));
});

app.use((_req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../public/views/404.html"));
});

export default app;
