import { Request, Response } from "express";
import {
  ILocationRepository,
  NewLocation,
} from "../../model/repository/use_cases/ILocationRespository.js";
import { PrismaLocationRepo } from "../../model/repository/infraestructure/PrismaLocationRepo.js";
import UserError from "../../model/entities/UserError.js";
import { validateDate, validateFloat } from "./CommonController.js";
import { IEquipementRepository } from "../../model/repository/use_cases/IEquipementRepository.js";
import { PrismaEquipementRepo } from "../../model/repository/infraestructure/PrismaEquipementRepository.js";
import { ISnapshotRepository } from "../../model/repository/use_cases/ISnapshotRepository.js";
import PrismaSnapshotRepository from "../../model/repository/infraestructure/PrismaSnapshotRepository.js";
import { ApiSnapshot, Location, Equipement } from "@prisma/client";

const snapshotRepo: ISnapshotRepository = new PrismaSnapshotRepository();
const equipementRepo: IEquipementRepository = new PrismaEquipementRepo();
const repo: ILocationRepository = new PrismaLocationRepo();

// Controlador para agregar una nueva localización
export const addLocation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      latitude,
      longitude,
      altitude,
      altitude_units,
      china_coordinate_id,
      date_time,
      serial_number,
    } = req.body;

    const msgErr: string[] = [];
    const location: Partial<NewLocation> = {};

    // Validar cada campo numérico usando validateFloat
    const latitudeValidation = validateFloat({
      input: latitude,
      valueName: "latitude",
    });

    if (latitudeValidation.msg) msgErr.push(latitudeValidation.msg);
    else location.latitude = latitudeValidation.number;

    const longitudeValidation = validateFloat({
      input: longitude,
      valueName: "longitude",
    });

    if (longitudeValidation.msg) msgErr.push(longitudeValidation.msg);
    else location.longitude = longitudeValidation.number;

    const altitudeValidation = validateFloat({
      input: altitude,
      valueName: "altitude",
    });

    if (altitudeValidation.msg) msgErr.push(altitudeValidation.msg);
    else location.altitude = altitudeValidation.number;

    if (location.china_coordinate_id) {
      const chinaCoordinateIdValidation = validateFloat({
        input: china_coordinate_id,
        valueName: "china_coordinate_id",
      });

      if (chinaCoordinateIdValidation.msg)
        msgErr.push(chinaCoordinateIdValidation.msg);
      else location.china_coordinate_id = chinaCoordinateIdValidation.number;
    }

    // Validación adicional para campos no numéricos
    if (!altitude_units) msgErr.push("altitude_units es requerido");
    else location.altitude_units = altitude_units;

    const dateValidation = validateDate(date_time);

    if (dateValidation.msg) msgErr.push(dateValidation.msg);
    else location.date_time = dateValidation.date;

    if (!serial_number) {
      msgErr.push("serial_number es requerido");
    } else {
      const equipement: Equipement | undefined =
        await equipementRepo.get(serial_number);

      if (!equipement) {
        msgErr.push("Equipo no encontrado");
      } else {
        const snapshot: ApiSnapshot = await snapshotRepo.add({
          serial_number,
          snapshot_version: "1.0.0",
          snapshot_datetime: new Date(),
        });

        location.snapshot_id = snapshot.snapshot_id;
      }
    }

    // Retorna errores o la estructura de location si es válida
    if (msgErr.length > 0) throw new UserError(msgErr.join(", "));

    await repo.add(location as NewLocation);

    res
      .status(201)
      .json({ message: "Registro de localización creado correctamente" });
  } catch (e) {
    if (e instanceof UserError) {
      res.status(400).json({ message: e.message });
    } else {
      console.error(e);
      res.status(500).json({ message: "Ocurrió un error inesperado" });
    }
  }
};

export const updateLocation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const location: Location = req.body;

    const msg = [];
    const keys = Object.keys(location) as Array<keyof Location>;

    for (const key of keys) {
      if (key === "china_coordinate_id") continue;

      if (!location[key]) {
        msg.push(`No se definió ${key}`);
      }
    }

    for (const key of keys) {
      if (typeof location[key] !== "number") continue;

      // Validación de existencia de input
      if (!location[key] && key !== "china_coordinate_id") {
        msg.push(`${key} no fue definido`);
        continue;
      }

      // Validación de que sea un número entero
      if (isNaN(location[key])) {
        msg.push(`${key} deber ser un número`);
        continue;
      }
    }

    if (location.snapshot_id) {
      const snapshot = await snapshotRepo.get(location.snapshot_id);
    }
    // await repo.update(location);
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
