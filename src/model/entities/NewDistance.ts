import { Distance } from "@prisma/client";

export type NewDistance = Omit<Distance, "distance_id" | "active">;
