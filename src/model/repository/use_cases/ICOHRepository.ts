import { CumulativeOperatingHours } from "@prisma/client";
import { NewCOH } from "../../entities/NewCumulativeOperatingHours.js";
import { Repository } from "./Repository.js";

export type ICOHRepository = Repository<
  CumulativeOperatingHours,
  NewCOH,
  number
>;
