import { Location } from "@prisma/client";
import { Repository } from "./Repository.js";

export type NewLocation = Omit<Location, "active" | "location_id">;
export type ILocationRepository = Repository<Location, NewLocation, number>;
