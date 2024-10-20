import { Equipement } from "@prisma/client";
import { IRepository } from "../../common/repository/IRepository";

export type NewEquipement = Omit<Equipement, "active">;
export type EquipementRepository = IRepository<Equipement>;
