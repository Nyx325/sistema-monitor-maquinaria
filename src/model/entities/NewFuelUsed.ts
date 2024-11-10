import { FuelUsed } from "@prisma/client";

export type NewFuelUsed = Omit<FuelUsed, "fuel_used_id" | "active">;
