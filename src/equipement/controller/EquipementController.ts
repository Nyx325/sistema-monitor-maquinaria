import { Request, Response } from "express";
import { Equipement } from "@prisma/client";
import { PrismaEquipementRepo } from "../repository/PrismaEquipementRepo";
import { EquipementRepository } from "../repository/EquipementRepository";

const repo: EquipementRepository = new PrismaEquipementRepo();

export const isNewEquipementValid = (
  model: Omit<Equipement, "serial_number">,
): void => {
  const msg: string[] = [];

  if (model.model === "") {
    msg.push("se debe colocar el modelo");
  }

  if (model.oem_name === "") {
    msg.push("se debe colocar el nombre del OEM");
  }

  if (msg.length > 0) throw Error(msg.join(", "));
};

export const isEquipementValid = (model: Equipement): void => {
  if (model.serial_number === "")
    throw Error("El número de serie no puede estar vacío");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { serial_number: _, ...newModel } = model;
  isNewEquipementValid(newModel);
};

export const addEquipement = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { equipement } = req.body;

  if (!equipement) {
    res
      .status(400)
      .json({ code: 400, error: "Datos del equipo no proporcionados" });
    return;
  }
  try {
    isNewEquipementValid(equipement);
    await repo.add(equipement);
    res.status(201).json({ code: 201, message: "Equipo creado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ code: 400, error });
  }
};

export const updateEquipement = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { equipement } = req.body;

  if (!equipement) {
    res
      .status(400)
      .json({ code: 400, error: "Datos del equipo no proporcionados" });
    return;
  }

  if (!equipement) {
    res
      .status(400)
      .json({ code: 400, error: "Datos del equipo no proporcionados" });
    return;
  }

  try {
    isNewEquipementValid(equipement);
    await repo.update(equipement);
    res.status(201).json({ code: 201, message: "Equipo creado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ code: 400, error });
  }
};

export const deleteEquipement = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { serialNumber } = req.params; // Obtenemos el número de serie desde los parámetros de la URL

  if (!serialNumber) {
    res.status(400).json({
      code: 400,
      error: "El número de serie no ha sido proporcionado",
    });
    return;
  }

  try {
    // Busca el equipo por su número de serie antes de eliminarlo (opcional)
    const equipementToDelete = await repo.getBy(
      { serial_number: serialNumber },
      1,
    );
    if (!equipementToDelete.result.length) {
      res.status(404).json({ code: 404, error: "Equipo no encontrado" });
      return;
    }

    // Elimina el equipo utilizando el número de serie
    await repo.permanentlyDeletion({
      serial_number: serialNumber,
    } as Equipement);
    res.status(200).json({ code: 200, message: "Equipo eliminado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ code: 400, error: error });
  }
};

export const getEquipement = async (
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
      pageNumber = "1", // Si no se envía pageNumber, por defecto es "1"
    } = req.query;

    // Crear un objeto de criterio que solo incluye las propiedades proporcionadas
    const criteria: Partial<Equipement> = {
      ...(serialNumber && { serial_number: String(serialNumber) }),
      ...(oemName && { oem_name: String(oemName) }),
      ...(model && { model: String(model) }),
      ...(equipementId && { equipement_id: String(equipementId) }),
    };

    // Validar si el número de página es un número válido
    const pageNum = parseInt(pageNumber as string, 10); // Convertir pageNumber a entero
    if (isNaN(pageNum) || pageNum <= 0) {
      res.status(400).json({
        code: 400,
        error: "Oops, el número de página debe ser un número positivo válido.",
      });

      return;
    }

    // Hacer la consulta al repositorio con los filtros y la paginación
    const result = await repo.getBy(criteria, pageNum);

    // Si no se encuentran resultados
    if (!result || result.result.length === 0) {
      res.status(404).json({
        code: 404,
        message: "No encontramos ningún equipo con esos filtros.",
      });

      return;
    }

    // Respuesta exitosa
    res.status(200).json({
      code: 200,
      result,
    });
  } catch (error) {
    console.error("Error al obtener los equipos: ", error);
    res.status(500).json({
      code: 500,
      error: "Hubo un problema en el servidor. Intenta de nuevo más tarde.",
    });
  }
};
