import { FuelRemaining } from "@prisma/client";
import { IRepository } from "./IRepository.js";
import { NewFuelRemaining } from "../../entities/NewFuelRemaining.js";

export type IFuelRemainingRepository = IRepository<
  FuelRemaining,
  NewFuelRemaining,
  number
>;
