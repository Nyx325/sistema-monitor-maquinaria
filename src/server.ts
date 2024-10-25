import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import apiRouter from "./api.js";
import webRouter from "./app.js";

dotenv.config();
const PORT = process.env.PORT ?? 3000;

// Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use("/api", apiRouter);
app.use("/", webRouter);

// Middleware para rutas no encontradas (404)
app.use((_req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../public/views/404.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
