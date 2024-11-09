import { Response, Request } from "express";
import UserError from "../../model/entities/UserError.js";
import { CumulativeOperatingHours } from "@prisma/client";
import { NewCOH } from "../../model/entities/NewCumulativeOperatingHours.js";
import { ICOHRepository } from "../../model/repository/use_cases/ICOHRepository.js";
import { PrismaCOHRepository } from "../../model/repository/infraestructure/PrismaCOHRepository.js";
import { IEquipementRepository } from "../../model/repository/use_cases/IEquipementRepository.js";
import { PrismaEquipementRepo } from "../../model/repository/infraestructure/PrismaEquipementRepository.js";
import { ISnapshotRepository } from "../../model/repository/use_cases/ISnapshotRepository.js";
import PrismaSnapshotRepository from "../../model/repository/infraestructure/PrismaSnapshotRepository.js";
import { validateInt } from "./CommonController.js";

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

export const updateCOH = async (req: Request, res: Response): Promise<void> => {
  try {
    const { coh_id, active, hour, date_time, snapshot_id } = req.body;

    const coh: CumulativeOperatingHours = {
      coh_id: Number(coh_id),
      active: active !== "false",
      hour: Number(hour),
      date_time: new Date(date_time),
      snapshot_id: Number(snapshot_id),
    };

    const msg = [];

    if (isNaN(Date.parse(date_time)))
      msg.push("formato de fecha y hora inválido");

    const keys = Object.keys(coh) as Array<keyof CumulativeOperatingHours>;
    for (const key of keys) {
      if (key === "date_time") continue;

      if (coh[key] === undefined) {
        msg.push(`${translateKey(key)} no fue definido`);
        continue;
      }

      if (typeof coh[key] === "number" && isNaN(coh[key]))
        msg.push(`${translateKey(key)} debe ser un número`);
    }

    if (msg.length > 0) throw new UserError(msg.join(", "));

    await repo.update(coh);
    res.status(200).json({ message: "Registro actualizado correctamente" });
  } catch (e) {
    if (e instanceof UserError) {
      res.status(400).json({ message: e.message });
    } else {
      console.error(e);
      res.status(500).json({ message: "Ocurrió un error inesperado" });
    }
  }
};

export const deleteCOH = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cohId } = req.params;

    if (cohId === undefined) {
      res.status(400).json({
        message: "No se proporcionó un ID",
      });
      return;
    }

    const validation = validateInt({
      input: cohId,
      valueName: "localización",
      positiveNumber: false,
    });

    if (validation.msg) {
      res.status(400).json({ message: validation.msg });
      return;
    }

    const record = await repo.get(validation.number as number);

    if (record === undefined) {
      res.status(404).json({ message: "Registro no encontrado" });
      return;
    }

    await repo.delete(record);
    res.status(200).json({ message: "Registro eliminado con éxito" });
  } catch (e) {
    if (e instanceof UserError) {
      res.status(400).json({ message: e.message });
    } else {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getCOH = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cohId } = req.params;

    if (cohId === undefined) {
      res.status(400).json({
        message: "No se proporcionó un ID",
      });

      return;
    }

    const validation = validateInt({
      input: cohId,
      valueName: "ID",
      positiveNumber: false,
    });

    if (validation.msg) {
      res.status(400).json({ message: validation.msg });
      return;
    }

    const result = await repo.get(validation.number as number);

    if (result === undefined)
      res.status(404).json({ message: "No se encontró el equipo" });
    else res.status(200).json(result);
  } catch (e) {
    if (e instanceof UserError) {
      res.status(400).json({ message: e.message });
    } else {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getCOHBy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { snapshotId, active, hour, dateTime, pageNumber = "1" } = req.query;

    const criteria = {
      hour: hour !== undefined ? Number(hour) : undefined,
      active: active === undefined ? undefined : active !== "false",
      date_time:
        dateTime !== undefined ? new Date(String(dateTime)) : undefined,
      snapshot_id: snapshotId !== undefined ? Number(snapshotId) : undefined,
    } as Partial<CumulativeOperatingHours>;

    const msg = [];

    const validation = validateInt({
      input: pageNumber as string,
      valueName: "numero de pagina",
      positiveNumber: true,
    });

    const page = validation.number ?? 1;

    if (validation.msg) msg.push(validation.msg);

    if (dateTime !== undefined && isNaN(Date.parse(String(dateTime))))
      msg.push("formato de fecha y hora inválidos");

    if (criteria.hour !== undefined && isNaN(criteria.hour))
      msg.push("la hora debe ser un número");

    if (msg.length > 0) throw new UserError(msg.join(", "));

    const result = await repo.getBy(criteria, page);
    res.status(200).json(result);
  } catch (e) {
    if (e instanceof UserError) {
      res.status(400).json({ message: e.message });
    } else {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
