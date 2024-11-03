import { Location } from "@prisma/client";
import { IRepository } from "./IRepository.js";

export type NewLocation = Omit<
  Location,
  "active" | "location_id" | "snapshot_id"
>;
export type ILocationRepository = IRepository<Location, NewLocation, number>;
