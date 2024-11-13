import { Request } from "express";
import { NewCIH } from "../../model/entities/NewCumulativeIdleHours.js";
import { PrismaCIHRepository } from "../../model/repository/infraestructure/PrismaCIHRepository.js";
import { PrismaEquipementRepo } from "../../model/repository/infraestructure/PrismaEquipementRepository.js";
import PrismaSnapshotRepository from "../../model/repository/infraestructure/PrismaSnapshotRepository.js";
import { ICIHRepository } from "../../model/repository/use_cases/ICIHRepository.js";
import { IEquipementRepository } from "../../model/repository/use_cases/IEquipementRepository.js";
import { ISnapshotRepository } from "../../model/repository/use_cases/ISnapshotRepository.js";
import { Controller } from "../use_cases/Controller.js";
import { ApiSnapshot, CumulativeIdleHours, Equipement } from "@prisma/client";
import UserError from "../../model/entities/UserError.js";

export class CIHController extends Controller {
  private readonly repo: ICIHRepository = new PrismaCIHRepository();
  private readonly snapshotRepo: ISnapshotRepository =
    new PrismaSnapshotRepository();
  private readonly equipementRepo: IEquipementRepository =
    new PrismaEquipementRepo();

  translateKey(key: string): string {
    const defaultVal = "campo desconocido";

    const campos: { [key: string]: string } = {
      snapshot_id: "ID de la snapshot",
      active: "activo o inactivo",
      date_time: "fecha y hora",
      serial_number: "numero de serie",
      hour: "horas inactivas",
    };

    return campos[key] ?? defaultVal;
  }

  protected async performAdd(r: Request): Promise<void> {
    const { hour, date_time, serial_number } = r.body;

    const record: Partial<NewCIH> = {
      hour: hour !== undefined ? Number(hour) : undefined,
      date_time: date_time !== undefined ? new Date(date_time) : undefined,
      snapshot_id: null,
    };

    const msg = [];

    if (isNaN(Date.parse(date_time)))
      msg.push("Formato de fecha y hora inválidos");

    const keys = Object.keys(record) as Array<keyof NewCIH>;
    for (const key of keys) {
      if (key === "date_time") continue;

      if (key !== "snapshot_id" && record[key] === undefined) {
        msg.push(`${this.translateKey(key)} no fue definido`);
        continue;
      }

      if (typeof record[key] === "number" && isNaN(record[key])) {
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

        record.snapshot_id = snapshot.snapshot_id;
      }
    }

    if (msg.length > 0) throw new UserError(msg.join(", "));

    await this.repo.add(record as CumulativeIdleHours);
  }

  protected async performUpdate(r: Request): Promise<void> {
    const { snapshot_id, active, date_time, hour } = r.body;

    const msg = [];

    const record: Partial<CumulativeIdleHours> = {
      date_time: new Date(date_time),
      active: active !== "false",
      snapshot_id: snapshot_id !== null ? Number(snapshot_id) : null,
      hour: hour !== undefined ? Number(hour) : undefined,
    };

    if (isNaN(Date.parse(date_time)))
      msg.push("formato de fecha y hora inválidos");

    const keys = Object.keys(record) as Array<keyof CumulativeIdleHours>;
    for (const key of keys) {
      if (key === "date_time") continue;

      if (key !== "snapshot_id" && record[key] === undefined) {
        msg.push(`${this.translateKey(key)} no fue definido`);
        continue;
      }

      if (typeof record[key] === "number" && isNaN(record[key])) {
        msg.push(`${this.translateKey(key)} debe ser un numero`);
        continue;
      }
    }

    const original = await this.repo.get(record.cih_id as number);
    if (original === undefined) msg.push("el regisstro a modificar no existe");
    if (msg.length > 0) throw new UserError(msg.join(", "));

    record.cih_id = original?.cih_id;
    record.snapshot_id = original?.snapshot_id;
    await this.repo.update(record as CumulativeIdleHours);
  }

  protected async performDetele(r: Request): Promise<void> {
    const { cihId } = r.params;

    if (!cihId) throw new UserError("No se proporcionó un ID");

    const validation = this.validateInt({
      input: cihId,
      valueName: "localización",
      positiveNumber: false,
    });

    if (validation.msg) throw new UserError(validation.msg);

    const record = await this.repo.get(validation.number as number);

    if (record === undefined) throw new UserError("Registro no encontrado");

    await this.repo.delete(record);
  }

  protected async performGet(r: Request): Promise<unknown | undefined> {
    const { cihId } = r.params;

    if (!cihId) throw new UserError("El ID no fue proporcionado");

    const validation = this.validateInt({
      input: cihId,
      valueName: "localización",
      positiveNumber: false,
    });

    if (validation.msg) throw new UserError(validation.msg);

    return await this.repo.get(validation.number as number);
  }

  protected async performGetBy(r: Request): Promise<unknown> {
    const { active, date_time, hour, pageNumer = "1" } = r.query;

    const criterio: Partial<CumulativeIdleHours> = {
      active: active !== "false",
      date_time:
        date_time !== undefined ? new Date(String(date_time)) : undefined,
      snapshot_id: undefined,
      hour: hour !== undefined ? Number(hour) : undefined,
    };

    const msg = [];

    const validation = this.validateInt({
      input: pageNumer as string,
      valueName: "numero de página",
      positiveNumber: true,
    });

    if (validation.msg) msg.push(validation.msg);
    const page = validation.number;

    const keys = Object.keys(criterio) as Array<
      keyof Partial<CumulativeIdleHours>
    >;

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
