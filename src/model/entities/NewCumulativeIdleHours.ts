import { CumulativeIdleHours } from "@prisma/client";

export type NewCIH = Omit<CumulativeIdleHours, "active" | "cih_id">;
