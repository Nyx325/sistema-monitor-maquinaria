import { CumulativeIdleHours } from "@prisma/client";
import { NewCIH } from "../../entities/NewCumulativeIdleHours.js";
import { IRepository } from "./IRepository.js";

export type ICIHRepository = IRepository<CumulativeIdleHours, NewCIH, number>;
