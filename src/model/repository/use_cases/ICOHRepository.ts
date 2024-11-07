import { CumulativeOperatingHours } from "@prisma/client";
import { IRepository } from "./IRepository.js";
import { NewCOH } from "../../entities/NewCumulativeOperatingHours.js";

export type ICOHRepository = IRepository<
  CumulativeOperatingHours,
  NewCOH,
  number
>;
