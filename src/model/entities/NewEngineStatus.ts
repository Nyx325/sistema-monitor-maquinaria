import { EngineStatus } from "@prisma/client";

export type NewEngineStatus = Omit<EngineStatus, "active" | "engine_status_id">;
