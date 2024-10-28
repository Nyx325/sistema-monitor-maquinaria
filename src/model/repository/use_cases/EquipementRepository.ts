import { Equipement } from "@prisma/client";
import { IRepository } from "./IRepository.js";

export type NewEquipement = Omit<Equipement, "active">;
export type EquipementRepository = IRepository<Equipement>;
