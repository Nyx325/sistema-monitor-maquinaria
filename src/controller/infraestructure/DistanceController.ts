import { Request } from "express";
import { PrismaDistanceRepository } from "../../model/repository/infraestructure/PrismaDistanceRepository.js";
import { PrismaEquipementRepo } from "../../model/repository/infraestructure/PrismaEquipementRepository.js";
import PrismaSnapshotRepository from "../../model/repository/infraestructure/PrismaSnapshotRepository.js";
import { IDistanceRepository } from "../../model/repository/use_cases/IDistanceRepository.js";
import { IEquipementRepository } from "../../model/repository/use_cases/IEquipementRepository.js";
import { ISnapshotRepository } from "../../model/repository/use_cases/ISnapshotRepository.js";
import { Controller } from "../use_cases/Controller.js";
import { ApiSnapshot, Distance, Equipement } from "@prisma/client";
import { NewDistance } from "../../model/entities/NewDistance.js";
import UserError from "../../model/entities/UserError.js";

export class DistanceController extends Controller {
  private readonly repo: IDistanceRepository = new PrismaDistanceRepository();
  private readonly snapshotRepo: ISnapshotRepository =
    new PrismaSnapshotRepository();
  private readonly equipementRepo: IEquipementRepository =
    new PrismaEquipementRepo();

  translateKey(key: string): string {
    const defaultVal = "campo desconocido";

    const campos: { [key: string]: string } = {
      distance_id: "ID del registro",
      odometer: "valor del odómetro",
      odometer_units: "unidades odómetro",
      active: "activo o inactivo",
      date_time: "fecha y hora",
      snapshot_id: "ID de la snapshot",
      serial_number: "numero de serie",
    };

    return campos[key] ?? defaultVal;
  }

  protected async performAdd(r: Request): Promise<void> {
    const { odometer, odometer_units, date_time, serial_number } = r.body;

    const distance: Partial<NewDistance> = {
      odometer: odometer !== undefined ? Number(odometer) : undefined,
      odometer_units:
        odometer_units !== undefined ? String(odometer_units) : undefined,
      date_time: new Date(date_time),
      snapshot_id: null,
    };

    const msg = [];

    if (isNaN(Date.parse(date_time)))
      msg.push("Formato de fecha y hora inválidos");

    const keys = Object.keys(distance) as Array<keyof NewDistance>;
    for (const key of keys) {
      if (key === "date_time") continue;

      if (key !== "snapshot_id" && distance[key] === undefined) {
        msg.push(`${this.translateKey(key)} no fue definido`);
        continue;
      }

      if (typeof distance[key] === "number" && isNaN(distance[key])) {
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

        distance.snapshot_id = snapshot.snapshot_id;
      }
    }

    if (msg.length > 0) throw new UserError(msg.join(", "));
    await this.repo.add(distance as NewDistance);
  }

  protected async performUpdate(r: Request): Promise<void> {
    const { distance_id, odometer, odometer_units, active, date_time } = r.body;

    const msg = [];

    const distance: Partial<Distance> = {
      active: active !== "false",
      odometer: odometer !== undefined ? Number(odometer) : undefined,
      date_time: new Date(date_time),
      odometer_units:
        odometer_units !== undefined ? String(odometer_units) : undefined,
      distance_id: distance_id !== undefined ? Number(distance_id) : undefined,
    };

    if (isNaN(Date.parse(date_time)))
      msg.push("formato de fecha y hora inválidos");

    const keys = Object.keys(distance) as Array<keyof Distance>;
    for (const key of keys) {
      if (key === "date_time") continue;

      if (key !== "snapshot_id" && distance[key] === undefined) {
        msg.push(`${this.translateKey(key)} no fue definido`);
        continue;
      }

      if (typeof distance[key] === "number" && isNaN(distance[key])) {
        msg.push(`${this.translateKey(key)} debe ser un numero`);
        continue;
      }
    }

    const original = await this.repo.get(distance.distance_id as number);
    if (original === undefined) msg.push("el regisstro a modificar no existe");
    if (msg.length > 0) throw new UserError(msg.join(", "));

    distance.snapshot_id = original?.snapshot_id as number;
    await this.repo.update(distance as Distance);
  }

  protected async performDetele(r: Request): Promise<void> {
    const { distanceId } = r.params;

    if (!distanceId) throw new UserError("No se proporcionó un ID");

    const validation = this.validateInt({
      input: distanceId,
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
    const { distanceId } = r.params; // Obtenemos el número de serie desde los parámetros de la URL

    if (!distanceId) throw new UserError("El ID no fue proporcionado");

    const validation = this.validateInt({
      input: distanceId,
      valueName: "ID del registro",
      positiveNumber: false,
    });

    if (validation.msg) throw new UserError(validation.msg);

    return await this.repo.get(validation.number as number);
  }

  protected async performGetBy(r: Request): Promise<unknown> {
    const {
      distanceId,
      odometer,
      odometerUnits,
      active,
      dateTime,
      pageNumber = "1",
    } = r.query;

    const msg = [];

    const distance: Partial<Distance> = {
      active: active !== "false",
      odometer: odometer !== undefined ? Number(odometer) : undefined,
      date_time:
        dateTime !== undefined ? new Date(String(dateTime)) : undefined,
      odometer_units:
        odometerUnits !== undefined ? String(odometerUnits) : undefined,
      distance_id: distanceId !== undefined ? Number(distanceId) : undefined,
    };

    const validation = this.validateInt({
      input: String(pageNumber),
      valueName: "número de página",
      positiveNumber: true,
    });

    if (dateTime !== undefined && isNaN(Date.parse(String(dateTime))))
      msg.push("formato de fecha y hora inválidos");

    const keys = Object.keys(distance) as Array<keyof Distance>;
    for (const key of keys) {
      if (key === "date_time" || distance[key] === undefined) continue;

      if (typeof distance[key] === "number" && isNaN(distance[key])) {
        msg.push(`${this.translateKey(key)} debe ser un numero`);
        continue;
      }
    }

    if (msg.length > 0) throw new UserError(msg.join(", "));

    return await this.repo.getBy(distance, validation.number as number);
  }
}
