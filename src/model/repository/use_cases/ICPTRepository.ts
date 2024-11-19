import { CumulativePayloadTotals } from "@prisma/client";
import { NewCPT } from "../../entities/NewCumulativePayloadTotals.js";
import { IRepository } from "./IRepository.js";

export type ICPTRepository = IRepository<
  CumulativePayloadTotals,
  NewCPT,
  number
>;
