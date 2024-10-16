import { Request, Response } from "express";
import { Equipement } from "@prisma/client";
import { PrismaEquipementRepo } from "../repository/PrismaEquipementRepo";

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
  const repo = new PrismaEquipementRepo();

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
