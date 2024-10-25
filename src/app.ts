import express from "express";
import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";

// Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.use("/css", express.static(path.join(__dirname, "../public/css")));
router.use("/js", express.static(path.join(__dirname, "../public/js")));
router.use("/scripts", express.static(path.join(__dirname, "../dist/scripts")));
router.use(
  "/components",
  express.static(path.join(__dirname, "../dist/components")),
);

router.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/index.html"));
});

router.get("/menu", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/menu.html"));
});

export default router;
