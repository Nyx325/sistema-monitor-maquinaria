import { Response, Request } from "express";
import UserError from "../../model/entities/UserError.js";
import { CumulativeOperatingHours } from "@prisma/client";
import { NewCOH } from "../../model/entities/NewCumulativeOperatingHours.js";
import { ICOHRepository } from "../../model/repository/use_cases/ICOHRepository.js";
import { PrismaCOHRepository } from "../../model/repository/infraestructure/COHRepository.js";
import { IEquipementRepository } from "../../model/repository/use_cases/IEquipementRepository.js";
import { PrismaEquipementRepo } from "../../model/repository/infraestructure/PrismaEquipementRepository.js";
import { ISnapshotRepository } from "../../model/repository/use_cases/ISnapshotRepository.js";
import PrismaSnapshotRepository from "../../model/repository/infraestructure/PrismaSnapshotRepository.js";

const repoSnapshots: ISnapshotRepository = new PrismaSnapshotRepository();
const repoEquipos: IEquipementRepository = new PrismaEquipementRepo();
const repo: ICOHRepository = new PrismaCOHRepository();

const translateKey = (key: string): string => {
  const defaultValue = "campo desconocido";
  const campos: { [key: string]: string } = {
    snapshot_id: "ID de la snapshot",
    active: "activo o inactivo",
    date_time: "fecha y hora",
    coh_id: "ID del registro",
    hour: "horas",
    serial_number: "número de serie",
  };

  return campos[key] ?? defaultValue;
};

export const addCOH = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date_time, hour, serial_number } = req.body;

    const coh: NewCOH = {
      hour: Number(hour),
      date_time: new Date(date_time),
      snapshot_id: null,
    };

    const msg = [];

    if (serial_number === undefined)
      msg.push("número de serie no especificado");

    if ((await repoEquipos.get(serial_number)) === undefined) {
      msg.push("equipo no encontrado");
    }

    if (isNaN(Date.parse(date_time)))
      msg.push("formato de fecha y hora inválido");

    const keys = Object.keys(coh) as Array<keyof NewCOH>;
    for (const key of keys) {
      if (key === "date_time") continue;

      if (coh[key] === undefined) {
        msg.push(`${translateKey(key)} no fue definido`);
        continue;
      }

      if (typeof coh[key] === "number" && isNaN(coh[key])) {
        msg.push(`${translateKey(key)} debe ser un numero`);
        continue;
      }
    }

    if (msg.length > 0) throw new UserError(msg.join(", "));

    const snapshot = await repoSnapshots.add({
      serial_number,
      snapshot_version: "1.0.0",
      snapshot_datetime: new Date(),
    });

    coh.snapshot_id = snapshot.snapshot_id;

    await repo.add(coh);
    res.status(201).json({ message: "Registro creado correctamente" });
  } catch (e) {
    if (e instanceof UserError) {
      res.status(400).json({ message: e.message });
    } else {
      console.error(e);
      res.status(500).json({ message: "Ocurrió un error inesperado" });
    }
  }
};
