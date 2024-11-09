import { Router } from "express";
import {
  addCOH,
  deleteCOH,
  getCOH,
  getCOHBy,
  updateCOH,
} from "../controller/infraestructure/COHController.js";

const cohRoutes = Router();
cohRoutes.post("/", addCOH);
cohRoutes.put("/", updateCOH);
cohRoutes.delete("/:cohId", deleteCOH);
cohRoutes.get("/:cohId", getCOH);
cohRoutes.get("/", getCOHBy);

export default cohRoutes;
