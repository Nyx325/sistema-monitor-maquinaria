import { Equipement } from "@prisma/client";
import { IAdapter } from "../use_cases/IAdapter.js";

export class EquipementAdapter extends IAdapter<
  Equipement,
  Equipement,
  string
> {
  constructor() {
    super("equipos");
  }
}
