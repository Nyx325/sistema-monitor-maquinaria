import PrismaSnapshotRepository from "../../model/repository/infraestructure/PrismaSnapshotRepository.js";
import {
  ISnapshotRepository,
  NewSnapshot,
} from "../../model/repository/use_cases/ISnapshotRepository.js";
import { IEquipementRepository } from "../../model/repository/use_cases/IEquipementRepository.js";
import { PrismaEquipementRepo } from "../../model/repository/infraestructure/PrismaEquipementRepository.js";
import UserError from "../../model/entities/UserError.js";
import { ApiSnapshot } from "@prisma/client";
import { Request, Response } from "express";
import { validateInt } from "./CommonController.js";

const repo: ISnapshotRepository = new PrismaSnapshotRepository();

const dateValid = (dateStr: string | Date) => {
  const date: Date = dateStr instanceof Date ? dateStr : new Date(dateStr);
  return !isNaN(new Date(date).getTime());
};

const isNewSnapshotValid = async (snapshot: NewSnapshot) => {
  const msg = [];

  if (!snapshot.snapshot_datetime) msg.push("no se definió una fecha");
  if (!snapshot.snapshot_version) msg.push("no se definió una version");
  if (!snapshot.serial_number) msg.push("no se definió un equipo");

  if (snapshot.snapshot_datetime && dateValid(snapshot.snapshot_datetime))
    msg.push(
      `El formato de fecha "${snapshot.snapshot_datetime}" no es válido`,
    );

  if (snapshot.serial_number) {
    const equipementRepo: IEquipementRepository = new PrismaEquipementRepo();
    const equipement = await equipementRepo.get(snapshot.serial_number);
    if (!equipement) msg.push("el equipo no existe");
  }

  if (msg.length > 0) throw new UserError(msg.join(", "));
};

const isSnapshotValid = async (s: ApiSnapshot) => {
  const msg = [];
  if (!s.active) msg.push("Activo o inactivo no definido");
  await isNewSnapshotValid(s);
};

export const addSnapshot = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const snapshot: NewSnapshot = req.body;
    snapshot.snapshot_datetime = new Date();
    await isNewSnapshotValid(snapshot);
    await repo.add(snapshot);
    res.status(201).json({ message: "Snapshot creado con éxito" });
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error");
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const updateSnapshot = async (req: Request, res: Response) => {
  try {
    // const snapshot: ApiSnapshot = req.body;
    const {
      snapshot_id,
      snapshot_datetime,
      active,
      snapshot_version,
      serial_number,
    } = req.body;

    const snapshot: ApiSnapshot = {
      snapshot_id,
      snapshot_datetime: new Date(snapshot_datetime),
      active,
      snapshot_version,
      serial_number,
    };

    await isSnapshotValid(snapshot);

    const search = await repo.get(snapshot.snapshot_id);
    if (search === undefined) throw new UserError("No se encontró la snapshot");

    repo.update(snapshot);

    res.status(200).json({ message: "Snapshot actualizada con éxito" });
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const deleteSnapshot = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { snapshotId } = req.params;

  if (!snapshotId) {
    res.status(400).json({
      message: "No se proporcionó un ID",
    });
    return;
  }

  const id: number = Number(snapshotId);
  if (isNaN(id)) {
    res.status(400).json({
      message: "El id debe ser un número",
    });
    return;
  }

  try {
    const snapshot = await repo.get(id);

    if (!snapshot) {
      res.status(404).json({ message: "Snapshot no encontrada" });
      return;
    }

    await repo.delete(snapshot);
    res.status(200).json({ message: "Snapshot eliminada con éxito" });
  } catch (e) {
    if (e instanceof UserError) {
      res.status(400).json({ message: e.message });
    } else {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getSnapshotBy = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      snapshotVersion,
      snapshotDatetime,
      active,
      serialNumber,
      pageNumber = "1",
    } = req.query;

    const msg = [];

    const pageValidation = validateInt({
      input: pageNumber as string | undefined,
      valueName: "Número de página",
      positiveNumber: true,
    });

    if (pageValidation.msg !== undefined) msg.push(pageValidation.msg);

    if (snapshotDatetime && !dateValid(String(snapshotDatetime)))
      msg.push(`El formato de fecha "${snapshotDatetime}" no es válido`);

    if (msg.length > 0) {
      res.status(404).json({ message: msg.join(", ") });
      return;
    }

    const pageNum = pageValidation.number as number;

    const date = snapshotDatetime
      ? new Date(String(snapshotDatetime))
      : undefined;

    const criteria: Partial<ApiSnapshot> = {
      active: active ? active !== "false" : undefined,
      serial_number: serialNumber ? String(serialNumber) : undefined,
      snapshot_version: snapshotVersion ? String(snapshotVersion) : undefined,
      snapshot_datetime: date,
    };

    const result = await repo.getBy(criteria, pageNum);
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

export const getSnapshot = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { snapshotId } = req.params;

    if (!snapshotId) {
      res.status(400).json({
        message: "No se proporcionó un ID",
      });
      return;
    }

    const validation = validateInt({
      input: snapshotId,
      positiveNumber: false,
      valueName: "Snapshot id",
    });

    if (validation.msg !== undefined) throw new UserError(validation.msg);

    const id = validation.number as number;

    const result = await repo.get(id);
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
