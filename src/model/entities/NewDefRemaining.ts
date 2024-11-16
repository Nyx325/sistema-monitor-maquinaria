import { DefRemaining } from "@prisma/client";

export type NewDefRemaining = Omit<DefRemaining, "active" | "def_remaining_id">;
