import { Request } from "express";
import { PrismaEquipementRepo } from "../../model/repository/infraestructure/PrismaEquipementRepository.js";
import PrismaSnapshotRepository from "../../model/repository/infraestructure/PrismaSnapshotRepository.js";
import { IEquipementRepository } from "../../model/repository/use_cases/IEquipementRepository.js";
import { ISnapshotRepository } from "../../model/repository/use_cases/ISnapshotRepository.js";
import { Controller } from "../use_cases/Controller.js";
import { ApiSnapshot, EngineStatus, Equipement } from "@prisma/client";
import UserError from "../../model/entities/UserError.js";
import { IEngineRepository } from "../../model/repository/use_cases/IEngineStatusRepository.js";
import { NewEngineStatus } from "../../model/entities/NewEngineStatus.js";
import { PrismaEngineRepo } from "../../model/repository/infraestructure/PrismaEngineRepository.js";

export class EngineStatusController extends Controller {
  private readonly repo: IEngineRepository = new PrismaEngineRepo();
  private readonly snapshotRepo: ISnapshotRepository =
    new PrismaSnapshotRepository();
  private readonly equipementRepo: IEquipementRepository =
    new PrismaEquipementRepo();

  translateKey(key: string): string {
    const defaultVal = "campo desconocido";

    const campos: { [key: string]: string } = {
      active: "activo o inactivo",
      date_time: "fecha y hora",
      snapshot_id: "ID de la snapshot",
      serial_number: "numero de serie",
      engine_status_id: "ID del registro",
      engine_number: "número del motor",
      running: "encendido",
    };

    return campos[key] ?? defaultVal;
  }

  protected async performAdd(r: Request): Promise<void> {
    const { date_time, engine_number, running, serial_number } = r.body;
    const record: Partial<NewEngineStatus> = {
      engine_number:
        engine_number !== undefined ? `${engine_number}` : undefined,
      running: running !== "false",
      date_time: new Date(date_time),
      snapshot_id: null,
    };

    const msg = [];

    if (isNaN(Date.parse(date_time)))
      msg.push("Formato de fecha y hora inválidos");

    const keys = Object.keys(record) as Array<keyof NewEngineStatus>;
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
        `${serial_number}`,
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
    await this.repo.add(record as NewEngineStatus);
  }

  protected async performUpdate(r: Request): Promise<void> {
    const { engine_status_id, date_time, engine_number, running, active } =
      r.body;

    const record: Partial<EngineStatus> = {
      active: active !== "false",
      date_time: new Date(date_time),
      running,
      engine_number:
        engine_number !== undefined ? `${engine_number}` : undefined,
      engine_status_id:
        engine_status_id !== undefined ? Number(engine_status_id) : undefined,
      snapshot_id: null,
    };

    const msg = [];

    if (isNaN(Date.parse(date_time)))
      msg.push("formato de fecha y hora inválidos");

    const keys = Object.keys(record) as Array<keyof EngineStatus>;
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

    const original = await this.repo.get(record.engine_status_id as number);
    if (original === undefined) msg.push("el regisstro a modificar no existe");
    if (msg.length > 0) throw new UserError(msg.join(", "));

    record.snapshot_id = original?.snapshot_id as number;
    await this.repo.update(record as EngineStatus);
  }

  protected async performDetele(r: Request): Promise<void> {
    const { engineStatusId } = r.params;

    if (!engineStatusId) throw new UserError("No se proporcionó un ID");

    const validation = this.validateInt({
      input: engineStatusId,
      valueName: "localización",
      positiveNumber: false,
    });

    if (validation.msg) throw new UserError(validation.msg);

    const record = await this.repo.get(validation.number as number);

    if (record === undefined) throw new UserError("Registro no encontrado");

    await this.repo.delete(record);
  }

  protected async performGet(r: Request): Promise<unknown | undefined> {
    const { engineStatusId } = r.params;
    if (!engineStatusId) throw new UserError("El ID no fue proporcionado");

    const validation = this.validateInt({
      input: engineStatusId,
      valueName: "ID del registro",
      positiveNumber: false,
    });

    if (validation.msg) throw new UserError(validation.msg);

    return await this.repo.get(validation.number as number);
  }

  protected async performGetBy(r: Request): Promise<unknown> {
    const {
      dateTime,
      engineNumber,
      running,
      active,
      pageNumber = "1",
    } = r.query;

    const msg = [];

    const criteria: Partial<EngineStatus> = {
      active: active !== undefined ? active !== "false" : undefined,
      date_time: dateTime !== undefined ? new Date(`${dateTime}`) : undefined,
      engine_number: engineNumber !== undefined ? `${engineNumber}` : undefined,
      running: running !== undefined ? running !== "false" : undefined,
    };

    const validation = this.validateInt({
      input: `${pageNumber}`,
      valueName: "número de página",
      positiveNumber: true,
    });

    if (dateTime !== undefined && isNaN(Date.parse(String(dateTime))))
      msg.push("formato de fecha y hora inválidos");

    const keys = Object.keys(criteria) as Array<keyof EngineStatus>;
    for (const key of keys) {
      if (key === "date_time") continue;

      if (
        criteria[key] !== undefined &&
        typeof criteria[key] === "number" &&
        isNaN(criteria[key])
      ) {
        msg.push(`${this.translateKey(key)} debe ser un numero`);
        continue;
      }
    }

    if (msg.length > 0) throw new UserError(msg.join(", "));

    return await this.repo.getBy(criteria, validation.number as number);
  }
}
