import { Request, Response } from "express";
import { PrismaEquipementRepo } from "../../model/repository/infraestructure/PrismaEquipementRepository.js";
import { PrismaFuelUsedRepository } from "../../model/repository/infraestructure/PrismaFuelUsedRepository.js";
import PrismaSnapshotRepository from "../../model/repository/infraestructure/PrismaSnapshotRepository.js";
import { IEquipementRepository } from "../../model/repository/use_cases/IEquipementRepository.js";
import { IFuelRepository } from "../../model/repository/use_cases/IFuelRepository.js";
import { ISnapshotRepository } from "../../model/repository/use_cases/ISnapshotRepository.js";
import { ApiSnapshot, Equipement, FuelUsed } from "@prisma/client";
import { NewFuelUsed } from "../../model/entities/NewFuelUsed.js";
import UserError from "../../model/entities/UserError.js";

const snapshotRepo: ISnapshotRepository = new PrismaSnapshotRepository();
const equipementRepo: IEquipementRepository = new PrismaEquipementRepo();
const repo: IFuelRepository = new PrismaFuelUsedRepository();

const translateKey = (key: string): string => {
  const defaultVal = "campo desconocido";

  const campos: { [key: string]: string } = {
    snapshot_id: "ID de la snapshot",
    active: "activo o inactivo",
    fuel_used_id: "ID del registro",
    fuel_consumed: "combustible consumido",
    date_time: "fecha y hora",
    fuel_units: "unidades del combustible",
    serial_number: "numero de serie",
  };

  return campos[key] ?? defaultVal;
};

export const addLocation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { fuel_consumed, fuel_units, date_time, serial_number } = req.body;

    const fuel: NewFuelUsed = {
      fuel_consumed: Number(fuel_consumed),
      fuel_units: String(fuel_units),
      date_time: new Date(date_time),
      snapshot_id: null,
    };

    const msg = [];

    if (isNaN(Date.parse(date_time)))
      msg.push("Formato de fecha y hora inválidos");

    const keys = Object.keys(fuel) as Array<keyof NewFuelUsed>;
    for (const key of keys) {
      if (key === "date_time") continue;

      if (key !== "snapshot_id" && fuel[key] === undefined) {
        msg.push(`${translateKey(key)} no fue definido`);
        continue;
      }

      if (typeof fuel[key] === "number" && isNaN(fuel[key])) {
        msg.push(`${translateKey(key)} debe ser un numero`);
        continue;
      }
    }

    if (!serial_number) {
      msg.push("Numero de serie requerido");
    } else {
      const equipement: Equipement | undefined =
        await equipementRepo.get(serial_number);

      if (!equipement) {
        msg.push("Equipo no encontrado");
      } else {
        const snapshot: ApiSnapshot = await snapshotRepo.add({
          serial_number,
          snapshot_version: "1.0.0",
          snapshot_datetime: new Date(),
        });

        fuel.snapshot_id = snapshot.snapshot_id;
      }
    }

    if (msg.length > 0) throw new UserError(msg.join(", "));

    await repo.add(fuel);
  } catch (e) {
    if (e instanceof UserError) {
      res.status(400).json({ message: e.message });
    } else {
      console.error(e);
      res.status(500).json({ message: "Ocurrió un error inesperado" });
    }
  }
};
