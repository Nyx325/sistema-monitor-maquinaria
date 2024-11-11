import { FuelUsed } from "@prisma/client";
import { NewFuelUsed } from "../../entities/NewFuelUsed.js";
import { IRepository } from "./IRepository.js";

export type IFuelRepository = IRepository<FuelUsed, NewFuelUsed, number>;
