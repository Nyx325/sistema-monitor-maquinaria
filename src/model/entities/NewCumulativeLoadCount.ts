import { CumulativeLoadCount } from "@prisma/client";

export type NewCLC = Omit<CumulativeLoadCount, "active" | "clo_id">;
