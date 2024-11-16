import express from "express";
import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";

// Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.use("/assets", express.static(path.join(__dirname, "../public/assets")));
router.use("/css", express.static(path.join(__dirname, "../public/css")));
router.use("/js", express.static(path.join(__dirname, "../public/js")));
router.use(
  "/scripts",
  express.static(path.join(__dirname, "../dist/view/scripts/")),
);
router.use(
  "/components",
  express.static(path.join(__dirname, "../dist/view/components/")),
);

router.use(
  "/adapters",
  express.static(path.join(__dirname, "../dist/view/adapters/")),
);

router.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/dash.html"));
});

router.get("/login", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/login.html"));
});

router.get("/equipos", (_request, response) => {
  response.sendFile(path.join(__dirname, "../public/views/equipement.html"));
});

router.get("/localizacion", (_request, response) => {
  response.sendFile(path.join(__dirname, "../public/views/location.html"));
});

router.get("/coh", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/coh.html"));
});

router.get("/combustibleUsado", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/fuelUsed.html"));
});

router.get("/combustibleUsado24", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/fuelUsed24.html"));
});

router.get("/reportes", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/reportes.html"));
});

router.get("/distancia", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/distance.html"));
});

router.get("/cih", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/cih.html"));
});

router.get("/combustibleRestante", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/fuelRemaining.html"));
});

router.get("/DEFRestante", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/defRemaining.html"));
});

export default router;
