import { Request, Response } from "express";
import {
  ILocationRepository,
  NewLocation,
} from "../../model/repository/use_cases/ILocationRespository.js";
import { PrismaLocationRepo } from "../../model/repository/infraestructure/PrismaLocationRepo.js";
import UserError from "../../model/entities/UserError.js";
import {
  validateDate,
  validateFloat,
  validateInt,
} from "./CommonController.js";
import { IEquipementRepository } from "../../model/repository/use_cases/IEquipementRepository.js";
import { PrismaEquipementRepo } from "../../model/repository/infraestructure/PrismaEquipementRepository.js";
import { ISnapshotRepository } from "../../model/repository/use_cases/ISnapshotRepository.js";
import PrismaSnapshotRepository from "../../model/repository/infraestructure/PrismaSnapshotRepository.js";
import { ApiSnapshot, Location, Equipement } from "@prisma/client";

const snapshotRepo: ISnapshotRepository = new PrismaSnapshotRepository();
const equipementRepo: IEquipementRepository = new PrismaEquipementRepo();
const repo: ILocationRepository = new PrismaLocationRepo();

const translateKey = (key: string): string => {
  const defaultValue = "campo desconocido";
  const campos: { [key: string]: string } = {
    latitude: "latitud",
    longitude: "longitud",
    altitude: "altitud",
    altitude_units: "unidades de altitud",
    china_coordinate_id: "id de coordenadas chinas",
    date_time: "fecha y hora",
    serial_number: "numero de serie",
  };

  return campos[key] ?? defaultValue;
};

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

    console.log(`Latitud ${latitude}`);

    const location: Partial<NewLocation> = {
      latitude: Number(latitude),
      longitude: Number(longitude),
      altitude: Number(altitude),
      altitude_units,
      china_coordinate_id: Number(china_coordinate_id),
      date_time: new Date(date_time),
    };

    console.log(location);
    console.log(serial_number);

    const msg = [];

    if (isNaN(Date.parse(date_time)))
      msg.push("Formato de fecha y hora no válido");

    const keys = Object.keys(location) as Array<keyof NewLocation>;
    for (const key of keys) {
      console.log(`Atributo ${key}: ${location[key]}`);
      if (key === "date_time") continue;

      if (
        key !== "china_coordinate_id" &&
        key !== "snapshot_id" &&
        location[key] === undefined
      ) {
        msg.push(`${translateKey(key)} no fue definido`);
        continue;
      }

      if (typeof location[key] === "number" && isNaN(location[key])) {
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

        location.snapshot_id = snapshot.snapshot_id;
      }
    }

    // Retorna errores o la estructura de location si es válida
    if (msg.length > 0) throw new UserError(msg.join(", "));

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
    const {
      snapshot_id,
      active,
      location_id,
      latitude,
      longitude,
      altitude,
      altitude_units,
      china_coordinate_id,
      date_time,
    } = req.body;

    console.log("\n\nInicio de solicitud HTTP");
    console.log(req.body);
    console.log("\n\n");

    const msg = [];

    const dateValidation = validateDate(date_time);
    if (dateValidation.msg) {
      msg.push("");
    }

    const location: Location = {
      snapshot_id: Number(snapshot_id),
      active: active !== "false",
      location_id: Number(location_id),
      latitude: Number(latitude),
      longitude: Number(longitude),
      altitude: Number(altitude),
      altitude_units,
      china_coordinate_id: Number(china_coordinate_id),
      date_time: dateValidation.date ?? new Date(),
    };

    const keys = Object.keys(location) as Array<keyof NewLocation>;
    for (const key of keys) {
      console.log(`Atributo ${key}: ${location[key]}`);
      if (key === "date_time") continue;

      if (
        key !== "china_coordinate_id" &&
        key !== "snapshot_id" &&
        location[key] === undefined
      ) {
        msg.push(`${translateKey(key)} no fue definido`);
        continue;
      }

      if (typeof location[key] === "number" && isNaN(location[key])) {
        msg.push(`${translateKey(key)} debe ser un numero`);
        continue;
      }
    }

    const original = await repo.get(location.location_id);

    if (original === undefined) msg.push("El registro a modificar no existe");
    if (msg.length > 0) throw new UserError(msg.join(", "));

    location.snapshot_id = original?.snapshot_id as number;

    await repo.update(location);
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

export const deleteLocation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { locationId } = req.params; // Obtenemos el número de serie desde los parámetros de la URL

  if (!locationId) {
    res.status(400).json({
      message: "No se proporcionó un ID",
    });
    return;
  }

  try {
    const validation = validateInt({
      input: locationId,
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

export const getLocation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { locationId } = req.params; // Obtenemos el número de serie desde los parámetros de la URL

    if (!locationId) {
      res.status(400).json({
        message: "El ID no fue proporcionado",
      });
      return;
    }

    const validation = validateInt({
      input: locationId,
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

export const getLocationBy = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      active,
      locationId,
      latitude,
      longitude,
      altitude,
      altitudeUnits,
      chinaCoordinateId,
      dateTime,
      pageNumer = "1",
    } = req.query;

    const criterio = {
      active: active !== "false",
      location_id: locationId,
      altitude,
      latitude,
      date_time: dateTime,
      longitude,
      snapshot_id: undefined,
      altitude_units: altitudeUnits,
      china_coordinate_id: chinaCoordinateId,
    } as Partial<Location>;

    const msg = [];

    const validation = validateInt({
      input: pageNumer as string,
      valueName: "numero de página",
      positiveNumber: true,
    });

    if (validation.msg) msg.push(validation.msg);
    const page = validation.number;

    const keys = Object.keys(criterio) as Array<keyof Partial<Location>>;

    for (const key of keys) {
      if (!criterio[key]) continue;

      if (typeof criterio[key] === "number") {
        const validation = validateFloat({
          valueName: key,
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
