import { EngineStatus } from "@prisma/client";
import { NewEngineStatus } from "../../entities/NewEngineStatus.js";
import { IRepository } from "./IRepository.js";

export type IEngineRepository = IRepository<
  EngineStatus,
  NewEngineStatus,
  number
>;
