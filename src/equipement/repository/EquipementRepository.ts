import { Equipement } from "@prisma/client";
import { IRepository } from "../../common/repository/IRepository";

export type EquipementRepository = IRepository<Equipement, Equipement>;
