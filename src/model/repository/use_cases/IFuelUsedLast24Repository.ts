import { FuelUsedLast24 } from "@prisma/client";
import { NewFuelUsedLast24 } from "../../entities/NewFuelUsedLast24.js";
import { IRepository } from "./IRepository.js";

export type IFuelUsedLast24Repository = IRepository<
  FuelUsedLast24,
  NewFuelUsedLast24,
  number
>;
