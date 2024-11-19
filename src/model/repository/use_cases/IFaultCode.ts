import { FaultCode } from "@prisma/client";
import { IRepository } from "./IRepository.js";
import { NewFaultCode } from "../../entities/NewFaultCode.js";

export type IFaultCodeRepository = IRepository<FaultCode, NewFaultCode, number>;
