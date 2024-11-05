import { IAdapter } from "./IAdapter.js";
import { Equipement } from "@prisma/client";

export type IEquipementAdapter = IAdapter<Equipement, Equipement, string>;
