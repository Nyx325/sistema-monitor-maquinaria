import { FaultCode } from "@prisma/client";

export type NewFaultCode = Omit<FaultCode, "active" | "folio">;
