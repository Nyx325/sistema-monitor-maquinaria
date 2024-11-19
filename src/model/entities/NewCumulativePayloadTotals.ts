import { CumulativePayloadTotals } from "@prisma/client";

export type NewCPT = Omit<CumulativePayloadTotals, "cpt_id" | "active">;
