import { Request, Response } from "express";
import { Equipement } from "@prisma/client";
import { PrismaEquipementRepo } from "../../model/repository/infraestructure/PrismaEquipementRepository.js";
import {
  NewEquipement,
  EquipementRepository,
} from "../../model/repository/use_cases/EquipementRepository.js";
import UserError from "../../model/entities/UserError.js";

const repo: EquipementRepository = new PrismaEquipementRepo();

export const isNewEquipementValid = async (
  model: NewEquipement,
  adding: boolean,
): Promise<void> => {
  const msg: string[] = [];

  if (adding === true && model.serial_number !== undefined) {
    const result = await repo.getBy({ serial_number: model.serial_number }, 1);

    if (result.result.length > 0) {
      msg.push("ya existe un elemento con ese número de serie");
    }
  }

  if (model.model === "") {
    msg.push("se debe colocar el modelo");
  }

  if (model.oem_name === "") {
    msg.push("se debe colocar el nombre del OEM");
  }

  if (msg.length > 0) {
    console.error(msg.join(", "));
    throw new UserError(msg.join(", "));
  }
};

export const isEquipementValid = async (model: Equipement): Promise<void> => {
  if (model.serial_number === "")
    throw new UserError("El número de serie no puede estar vacío");

  const newModel: NewEquipement = {
    serial_number: model.serial_number,
    model: model.model,
    oem_name: model.oem_name,
  };

  await isNewEquipementValid(newModel, false);
};

export const addEquipement = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const newEquipement: NewEquipement = req.body;

    if (!newEquipement) {
      res.status(400).json({ message: "Datos del equipo no proporcionados" });
      return;
    }

    const msg = [];

    if (newEquipement.serial_number === undefined) {
      msg.push("se debe especificar un numero de serie");
    }

    if (newEquipement.model === undefined) {
      msg.push("se debe especificar el modelo");
    }

    if (newEquipement.oem_name === undefined) {
      msg.push("se debe especificar el nombre del oem");
    }

    if (msg.length !== 0)
      throw new UserError("Campos faltantes: " + msg.join(","));

    await isNewEquipementValid(newEquipement, true);

    const equipement: Equipement = {
      serial_number: newEquipement.serial_number,
      oem_name: newEquipement.oem_name,
      model: newEquipement.model,
      active: true,
    };

    await repo.add(equipement);
    res.status(201).json({ message: "Equipo creado con éxito" });
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const updateEquipement = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const equipement: Equipement = req.body;

    const msg = [];

    if (equipement.serial_number === undefined) {
      msg.push("se debe especificar un numero de serie");
    }

    if (equipement.model === undefined) {
      msg.push("se debe especificar el modelo");
    }

    if (equipement.oem_name === undefined) {
      msg.push("se debe especificar el nombre del oem");
    }

    if (equipement.active === undefined) {
      msg.push("se debe especificar el estado (activo o inactivo)");
    }
    if (msg.length !== 0)
      throw new UserError("Campos faltantes: " + msg.join(","));

    await isNewEquipementValid(equipement, false);
    await repo.update(equipement);
    res.status(201).json({ message: "Equipo creado con éxito" });
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const deleteEquipement = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { serialNumber } = req.params; // Obtenemos el número de serie desde los parámetros de la URL

  if (!serialNumber) {
    res.status(400).json({
      message: "El número de serie no ha sido proporcionado",
    });
    return;
  }

  try {
    if (repo.get(serialNumber) === undefined)
      throw new UserError("El elemento no existe");

    // Busca el equipo por su número de serie antes de eliminarlo (opcional)
    const equipement = await repo.get(serialNumber);

    if (equipement === undefined) {
      res.status(404).json({ message: "Equipo no encontrado" });
      return;
    }

    // Elimina el equipo utilizando el número de serie
    await repo.delete({
      serial_number: serialNumber,
    } as Equipement);
    res.status(200).json({ message: "Equipo eliminado con éxito" });
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getEquipementBy = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Extraer parámetros de consulta de la URL y asignar valores predeterminados
    const {
      serialNumber,
      oemName,
      model,
      equipementId,
      active,
      pageNumber = "1", // Si no se envía pageNumber, por defecto es "1"
    } = req.query;

    const criteria: Partial<Equipement> = {
      ...(serialNumber && { serial_number: String(serialNumber) }),
      ...(oemName && { oem_name: String(oemName) }),
      ...(model && { model: String(model) }),
      ...(equipementId && { equipement_id: String(equipementId) }),
      ...(active && { active: active !== "false" }),
    };

    const pageNum = parseInt(pageNumber as string, 10);
    if (isNaN(pageNum) || pageNum <= 0) {
      res.status(400).json({
        message: "El número de página debe ser un número positivo válido.",
      });

      return;
    }

    const result = await repo.getBy(criteria, pageNum);

    if (!result || result.result.length === 0) {
      res.status(404).json({
        message: "No encontramos ningún equipo con esos filtros.",
      });

      return;
    }

    // Respuesta exitosa
    res.status(200).json({
      search: result,
    });
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getEquipement = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { serialNumber } = req.params; // Obtenemos el número de serie desde los parámetros de la URL

    if (!serialNumber) {
      res.status(400).json({
        message: "El número de serie no ha sido proporcionado",
      });
      return;
    }

    const result = await repo.get(serialNumber);
    if (result === undefined)
      res.status(404).json({ message: "No se encontró el equipo" });
    else res.status(200).json({ equipement: result });
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
