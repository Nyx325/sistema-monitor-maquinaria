import { Request, Response } from "express";
import {
  ILocationRepository,
  NewLocation,
} from "../../model/repository/use_cases/ILocationRespository.js";
import { PrismaLocationRepo } from "../../model/repository/infraestructure/PrismaLocationRepo.js";
import UserError from "../../model/entities/UserError.js";

const repo: ILocationRepository = new PrismaLocationRepo();

// Validación de `NewLocation`
const isNewLocationValid = (l: Partial<NewLocation>) => {
  const msg: string[] = [];

  const titles: { [key in keyof NewLocation]?: string } = {
    latitude: "latitud",
    longitude: "longitud",
    altitude: "altitud",
    altitude_units: "unidades de la altitud",
    date_time: "fecha del registro",
  };

  if (!l) {
    throw new UserError("Datos de la localización no proporcionados");
  }

  for (const key in titles) {
    const title = titles[key as keyof NewLocation];
    const value = l[key as keyof NewLocation];

    // Excluir china_coordinate_id de la validación de campo requerido
    if (key === "china_coordinate_id") continue;

    // Validar que los campos requeridos no sean null o undefined
    if (value == null) {
      msg.push(`Campo ${title} no proporcionado`);
    }
  }

  if (l.altitude != null && isNaN(l.altitude))
    msg.push("la altitud debe ser un número");

  if (l.latitude != null && isNaN(l.latitude))
    msg.push("la latitud debe ser un número");

  if (l.longitude != null && isNaN(l.longitude))
    msg.push("la longitud debe ser un número");

  if (l.china_coordinate_id != null && isNaN(l.china_coordinate_id))
    msg.push("las coordenadas chinas deben ser un número");

  // Validación del campo `date_time`
  if (
    (l.date_time && !(l.date_time instanceof Date)) ||
    isNaN(l.date_time?.getTime() as number)
  ) {
    msg.push("La fecha del registro (date_time) es inválida");
  }

  if (msg.length > 0) throw new UserError(msg.join(", "));
};

// Controlador para agregar una nueva localización
export const addLocation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const location = req.body;

    // Parseo y conversión de `date_time` a Date
    if (
      typeof location.date_time === "string" &&
      Date.parse(location.date_time)
    ) {
      location.date_time = new Date(location.date_time);
    } else {
      throw new UserError(
        "El campo date_time debe ser una fecha válida en formato ISO",
      );
    }

    // Validación de la localización
    isNewLocationValid(location);

    // Creación del objeto `NewLocation` después de la validación
    const newLocation: NewLocation = {
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude),
      altitude: parseFloat(location.altitude),
      altitude_units: location.altitude_units,
      china_coordinate_id: location.china_coordinate_id ?? null,
      date_time: location.date_time,
    };

    await repo.add(newLocation);

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
