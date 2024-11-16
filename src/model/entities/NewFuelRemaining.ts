import { FuelRemaining } from "@prisma/client";

export type NewFuelRemaining = Omit<
  FuelRemaining,
  "active" | "fuel_remaining_id"
>;
