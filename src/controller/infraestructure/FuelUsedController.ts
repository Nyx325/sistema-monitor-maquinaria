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
import {
  validateDate,
  validateFloat,
  validateInt,
} from "./CommonController.js";

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

export const addFuelUsed = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { fuel_consumed, fuel_units, date_time, serial_number } = req.body;

    const fuel: Partial<NewFuelUsed> = {
      fuel_consumed:
        fuel_consumed !== undefined ? Number(fuel_consumed) : undefined,
      fuel_units: fuel_units !== undefined ? String(fuel_units) : undefined,
      date_time: date_time !== undefined ? new Date(date_time) : undefined,
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
      const equipement: Equipement | undefined = await equipementRepo.get(
        String(serial_number),
      );

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

    await repo.add(fuel as NewFuelUsed);

    res
      .status(201)
      .json({ message: "Registro de combustible usado creado correctamente" });
  } catch (e) {
    if (e instanceof UserError) {
      res.status(400).json({ message: e.message });
    } else {
      console.error(e);
      res.status(500).json({ message: "Ocurrió un error inesperado" });
    }
  }
};

export const updateFuelUsed = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      snapshot_id,
      active,
      fuel_used_id,
      fuel_consumed,
      date_time,
      fuel_units,
    } = req.body;

    const msg = [];

    const fuel: Partial<FuelUsed> = {
      fuel_units: fuel_units !== undefined ? String(fuel_units) : undefined,
      date_time: new Date(date_time),
      fuel_consumed:
        fuel_consumed !== undefined ? Number(fuel_consumed) : undefined,
      fuel_used_id:
        fuel_used_id !== undefined ? Number(fuel_used_id) : undefined,
      active: active !== "false",
      snapshot_id: snapshot_id !== null ? Number(snapshot_id) : null,
    };

    if (isNaN(Date.parse(date_time)))
      msg.push("formato de fecha y hora inválidos");

    const keys = Object.keys(fuel) as Array<keyof FuelUsed>;
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

    const original = await repo.get(fuel.fuel_used_id as number);
    if (original === undefined) msg.push("el regisstro a modificar no existe");
    if (msg.length > 0) throw new UserError(msg.join(", "));

    fuel.snapshot_id = original?.snapshot_id as number;
    await repo.update(fuel as FuelUsed);
    res
      .status(200)
      .json({ message: "Registro de localización actualizado correctamente" });
  } catch (e) {
    if (e instanceof UserError) {
      res.status(400).json({ message: e.message });
    } else {
      console.error(e);
      res.status(500).json({ message: "Ocurrió un error inesperado" });
    }
  }
};

export const deleteFuelUsed = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { fuelUsedId } = req.params;

  if (!fuelUsedId) {
    res.status(400).json({
      message: "No se proporcionó un ID",
    });
    return;
  }

  try {
    const validation = validateInt({
      input: fuelUsedId,
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

    // Elimina el equipo utilizando el número de serie
    await repo.delete(record);
    res.status(200).json({ message: "Registro eliminado con éxito" });
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getFuelUsed = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { fuelUsedId } = req.params; // Obtenemos el número de serie desde los parámetros de la URL

    if (!fuelUsedId) {
      res.status(400).json({
        message: "El ID no fue proporcionado",
      });
      return;
    }

    const validation = validateInt({
      input: fuelUsedId,
      valueName: "localización",
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
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getFuelUsedBy = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      active,
      fuel_consumed,
      date_time,
      fuel_units,
      pageNumer = "1",
    } = req.query;

    const criterio: Partial<FuelUsed> = {
      active: active !== "false",
      fuel_consumed:
        fuel_consumed !== undefined ? Number(fuel_consumed) : undefined,
      fuel_units: fuel_units !== undefined ? String(fuel_units) : undefined,
      date_time:
        date_time !== undefined ? new Date(String(date_time)) : undefined,
      snapshot_id: undefined,
    };

    const msg = [];

    const validation = validateInt({
      input: pageNumer as string,
      valueName: "numero de página",
      positiveNumber: true,
    });

    if (validation.msg) msg.push(validation.msg);
    const page = validation.number;

    const keys = Object.keys(criterio) as Array<keyof Partial<FuelUsed>>;

    for (const key of keys) {
      if (criterio[key] === undefined) continue;

      if (typeof criterio[key] === "number") {
        const validation = validateFloat({
          valueName: translateKey(key),
          input: String(criterio[key]),
        });

        if (validation.msg !== undefined) msg.push(validation.msg);
      }

      if (typeof criterio[key] === "number") {
        const validation = validateFloat({
          valueName: key,
          input: String(criterio[key]),
        });

        if (validation.msg !== undefined) msg.push(validation.msg);
        continue;
      }

      if (key === "date_time") {
        const validation = validateDate(String(criterio[key]));
        if (validation.msg !== undefined) msg.push(validation.msg);
        continue;
      }
    }

    if (msg.length > 0) throw new UserError(msg.join(", "));

    const result = await repo.getBy(criterio, page as number);
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
