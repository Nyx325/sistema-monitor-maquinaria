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

const repo: ISnapshotRepository = new PrismaSnapshotRepository();

const isNewSnapshotValid = async (snapshot: NewSnapshot) => {
  const msg = [];

  if (!snapshot.snapshot_datetime) msg.push("no se definió una fecha");
  if (!snapshot.snapshot_version) msg.push("no se definió una version");
  if (!snapshot.serial_number) msg.push("no se definió un equipo");

  if (
    snapshot.snapshot_datetime &&
    isNaN(new Date(snapshot.snapshot_datetime).getTime())
  )
    msg.push("El formato de la fecha no es válido");

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
