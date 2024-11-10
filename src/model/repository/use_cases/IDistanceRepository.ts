import { Distance } from "@prisma/client";
import { IRepository } from "./IRepository.js";
import { NewDistance } from "../../entities/NewDistance.js";

export type IDistanceRepository = IRepository<Distance, NewDistance, number>;
