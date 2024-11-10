import { FuelUsedLast24 } from "@prisma/client";

export type NewFuelUsedLast24 = Omit<FuelUsedLast24, "fuel_used_id" | "active">;
