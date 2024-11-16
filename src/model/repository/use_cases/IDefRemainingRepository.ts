import { DefRemaining } from "@prisma/client";
import { NewDefRemaining } from "../../entities/NewDefRemaining.js";
import { IRepository } from "./IRepository.js";

export type IDefRemainingRepository = IRepository<
  DefRemaining,
  NewDefRemaining,
  number
>;
