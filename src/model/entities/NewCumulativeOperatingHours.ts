import { CumulativeOperatingHours } from "@prisma/client";

export type NewCOH = Omit<CumulativeOperatingHours, "coh_id" | "active">;
