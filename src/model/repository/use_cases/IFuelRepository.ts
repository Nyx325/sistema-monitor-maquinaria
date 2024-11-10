import { FuelUsed } from "@prisma/client";
import { NewFuelUsed } from "../../entities/NewFuelUsed.js";
import { Repository } from "./Repository.js";

export type IFuelRepository = Repository<FuelUsed, NewFuelUsed, number>;
