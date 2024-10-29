import { Location } from "@prisma/client";
import { IRepository } from "./IRepository.js";

export type NewLocation = Omit<Location, "active">;
export type LocationRepository = IRepository<Location, number>;
