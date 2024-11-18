import { CumulativeLoadCount } from "@prisma/client";
import { NewCLC } from "../../entities/NewCumulativeLoadCount.js";
import { IRepository } from "./IRepository.js";

export type ICLCRepository = IRepository<CumulativeLoadCount, NewCLC, number>;
