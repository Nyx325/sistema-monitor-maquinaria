import { Request } from "express";
import { Controller } from "../use_cases/Controller.js";
import { NewFuelUsed } from "../../model/entities/NewFuelUsed.js";
import { ApiSnapshot, Equipement, FuelUsed } from "@prisma/client";
import { IFuelRepository } from "../../model/repository/use_cases/IFuelRepository.js";
import { PrismaFuelUsedRepository } from "../../model/repository/infraestructure/PrismaFuelUsedRepository.js";
import { IEquipementRepository } from "../../model/repository/use_cases/IEquipementRepository.js";
import { PrismaEquipementRepo } from "../../model/repository/infraestructure/PrismaEquipementRepository.js";
import { ISnapshotRepository } from "../../model/repository/use_cases/ISnapshotRepository.js";
import PrismaSnapshotRepository from "../../model/repository/infraestructure/PrismaSnapshotRepository.js";
import UserError from "../../model/entities/UserError.js";

export class FuelUsedController extends Controller {
  private readonly repo: IFuelRepository = new PrismaFuelUsedRepository();
  private readonly snapshotRepo: ISnapshotRepository =
    new PrismaSnapshotRepository();
  private readonly equipementRepo: IEquipementRepository =
    new PrismaEquipementRepo();

  translateKey(key: string): string {
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
  }

  protected async performAdd(r: Request): Promise<void> {
    const { fuel_consumed, fuel_units, date_time, serial_number } = r.body;

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
        msg.push(`${this.translateKey(key)} no fue definido`);
        continue;
      }

      if (typeof fuel[key] === "number" && isNaN(fuel[key])) {
        msg.push(`${this.translateKey(key)} debe ser un numero`);
        continue;
      }
    }

    if (!serial_number) {
      msg.push("Numero de serie requerido");
    } else {
      const equipement: Equipement | undefined = await this.equipementRepo.get(
        String(serial_number),
      );

      if (!equipement) {
        msg.push("Equipo no encontrado");
      } else {
        const snapshot: ApiSnapshot = await this.snapshotRepo.add({
          serial_number,
          snapshot_version: "1.0.0",
          snapshot_datetime: new Date(),
        });

        fuel.snapshot_id = snapshot.snapshot_id;
      }
    }

    if (msg.length > 0) throw new UserError(msg.join(", "));

    await this.repo.add(fuel as NewFuelUsed);
  }

  protected async performUpdate(r: Request): Promise<void> {
    const {
      snapshot_id,
      active,
      fuel_used_id,
      fuel_consumed,
      date_time,
      fuel_units,
    } = r.body;

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
        msg.push(`${this.translateKey(key)} no fue definido`);
        continue;
      }

      if (typeof fuel[key] === "number" && isNaN(fuel[key])) {
        msg.push(`${this.translateKey(key)} debe ser un numero`);
        continue;
      }
    }

    const original = await this.repo.get(fuel.fuel_used_id as number);
    if (original === undefined) msg.push("el regisstro a modificar no existe");
    if (msg.length > 0) throw new UserError(msg.join(", "));

    fuel.snapshot_id = original?.snapshot_id as number;
    await this.repo.update(fuel as FuelUsed);
  }

  protected async performDetele(r: Request): Promise<void> {
    const { fuelUsedId } = r.params;

    if (!fuelUsedId) throw new UserError("No se proporcionó un ID");

    const validation = this.validateInt({
      input: fuelUsedId,
      valueName: "localización",
      positiveNumber: false,
    });

    if (validation.msg) throw new UserError(validation.msg);

    const record = await this.repo.get(validation.number as number);

    if (record === undefined) throw new UserError("Registro no encontrado");

    // Elimina el equipo utilizando el número de serie
    await this.repo.delete(record);
  }

  protected async performGet(r: Request): Promise<unknown | undefined> {
    const { fuelUsedId } = r.params; // Obtenemos el número de serie desde los parámetros de la URL

    if (!fuelUsedId) throw new UserError("El ID no fue proporcionado");

    const validation = this.validateInt({
      input: fuelUsedId,
      valueName: "localización",
      positiveNumber: false,
    });

    if (validation.msg) throw new UserError(validation.msg);

    return await this.repo.get(validation.number as number);
  }

  protected async performGetBy(r: Request): Promise<unknown> {
    const {
      active,
      fuel_consumed,
      date_time,
      fuel_units,
      pageNumer = "1",
    } = r.query;

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

    const validation = this.validateInt({
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
        const validation = this.validateFloat({
          valueName: this.translateKey(key),
          input: String(criterio[key]),
        });

        if (validation.msg !== undefined) msg.push(validation.msg);
      }

      if (typeof criterio[key] === "number") {
        const validation = this.validateFloat({
          valueName: key,
          input: String(criterio[key]),
        });

        if (validation.msg !== undefined) msg.push(validation.msg);
        continue;
      }

      if (key === "date_time") {
        const validation = this.validateDate(String(criterio[key]));
        if (validation.msg !== undefined) msg.push(validation.msg);
        continue;
      }
    }

    if (msg.length > 0) throw new UserError(msg.join(", "));

    return await this.repo.getBy(criterio, page as number);
  }
}
