import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT ?? 3000;

import path from "path";

// Middleware para rutas no encontradas (404)
app.use((_req, res) => {
  // Si llegamos aquí, la ruta no existe, devolver 404 y mostrar una página personalizada
  res.status(404).sendFile(path.join(__dirname, "../public/views/404.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
