import { EngineStatus } from "@prisma/client";

export type NewEngineStatus = Omit<EngineStatus, "active">;
