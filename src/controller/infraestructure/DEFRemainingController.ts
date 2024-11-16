import { PrismaEquipementRepo } from "../../model/repository/infraestructure/PrismaEquipementRepository.js";
import PrismaSnapshotRepository from "../../model/repository/infraestructure/PrismaSnapshotRepository.js";
import { IEquipementRepository } from "../../model/repository/use_cases/IEquipementRepository.js";
import { ISnapshotRepository } from "../../model/repository/use_cases/ISnapshotRepository.js";
import { Controller } from "../use_cases/Controller.js";
import UserError from "../../model/entities/UserError.js";
import { ApiSnapshot, Equipement, DefRemaining } from "@prisma/client";
import { Request } from "express";
import { IDefRemainingRepository } from "../../model/repository/use_cases/IDefRemainingRepository.js";
import { PrismaDEFRemainingRepository } from "../../model/repository/infraestructure/PrismaDEFRemaining.js";
import { NewDefRemaining } from "../../model/entities/NewDefRemaining.js";

export class DEFRemainingController extends Controller {
  private readonly repo: IDefRemainingRepository =
    new PrismaDEFRemainingRepository();
  private readonly snapshotRepo: ISnapshotRepository =
    new PrismaSnapshotRepository();
  private readonly equipementRepo: IEquipementRepository =
    new PrismaEquipementRepo();

  translateKey(key: string): string {
    const defaultVal = "campo desconocido";

    const campos: { [key: string]: string } = {
      snapshot_id: "ID de la snapshot",
      active: "activo o inactivo",
      serial_number: "numero de serie",
      def_remaining_id: "ID del registro",
      percent: "porcentaje restante",
    };

    return campos[key] ?? defaultVal;
  }

  protected async performAdd(r: Request): Promise<void> {
    const { serial_number, percent, date_time } = r.body;

    const record: Partial<NewDefRemaining> = {
      percent: percent !== undefined ? Number(percent) : undefined,
      date_time: date_time !== undefined ? new Date(date_time) : undefined,
      snapshot_id: null,
    };

    const msg = [];

    if (isNaN(Date.parse(date_time)))
      msg.push("Formato de fecha y hora inválidos");

    const keys = Object.keys(record) as Array<keyof NewDefRemaining>;
    for (const key of keys) {
      if (key === "date_time") continue;

      if (key !== "snapshot_id" && record[key] === undefined) {
        msg.push(`${this.translateKey(key)} no fue definido`);
        continue;
      }

      if (
        typeof record[key] === "number" &&
        (isNaN(record[key]) || record[key] < 0 || record[key] > 100)
      ) {
        msg.push(`${this.translateKey(key)} debe ser un numero entre 0 y 100`);
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

    await this.repo.add(record as NewDefRemaining);
  }

  protected async performUpdate(r: Request): Promise<void> {
    const { def_remaining_id, percent, date_time, active } = r.body;

    const record: Partial<DefRemaining> = {
      active: active !== "false",
      percent: percent !== undefined ? Number(percent) : undefined,
      date_time: date_time !== undefined ? new Date(date_time) : undefined,
      def_remaining_id:
        def_remaining_id !== undefined ? Number(def_remaining_id) : undefined,
      snapshot_id: null,
    };

    const msg = [];

    if (isNaN(Date.parse(date_time)))
      msg.push("Formato de fecha y hora inválidos");

    const keys = Object.keys(record) as Array<keyof DefRemaining>;
    for (const key of keys) {
      if (key === "date_time") continue;

      if (key !== "snapshot_id" && record[key] === undefined) {
        msg.push(`${this.translateKey(key)} no fue definido`);
        continue;
      }

      if (
        typeof record[key] === "number" &&
        (isNaN(record[key]) || record[key] < 0 || record[key] > 100)
      ) {
        msg.push(`${this.translateKey(key)} debe ser un numero entre 0 y 100`);
        continue;
      }
    }

    const original = await this.repo.get(Number(record.def_remaining_id));
    if (original === undefined) msg.push("el registro a modificar no existe");
    if (msg.length > 0) throw new UserError(msg.join(", "));

    record.snapshot_id = original?.snapshot_id as number;
    await this.repo.update(record as DefRemaining);
  }

  protected async performDetele(r: Request): Promise<void> {
    const { defRemainingId } = r.params;

    const validation = this.validateInt({
      input: defRemainingId,
      valueName: "ID del registro",
      positiveNumber: false,
    });

    if (validation.msg) throw new UserError(validation.msg);

    const record = await this.repo.get(validation.number as number);

    if (record === undefined) throw new UserError("No se encontró el registro");

    await this.repo.delete(record);
  }

  protected async performGet(r: Request): Promise<unknown | undefined> {
    const { defRemainingId } = r.params;

    const validation = this.validateInt({
      input: defRemainingId,
      valueName: "ID del registro",
      positiveNumber: false,
    });

    if (validation.msg) throw new UserError(validation.msg);

    return await this.repo.get(validation.number as number);
  }

  protected async performGetBy(r: Request): Promise<unknown> {
    const { percent, date_time, active, pageNumber = "1" } = r.query;

    const criteria: Partial<DefRemaining> = {
      active: active !== "false",
      percent: percent !== undefined ? Number(percent) : undefined,
      date_time: percent !== undefined ? new Date(`${date_time}`) : undefined,
    };

    const msg = [];

    const validation = this.validateInt({
      input: pageNumber as string,
      valueName: "numero de página",
      positiveNumber: true,
    });

    if (validation.msg) msg.push(validation.msg);
    const page = validation.number;

    if (date_time !== undefined && isNaN(Date.parse(`${date_time}`)))
      msg.push("formato de fecha y hora inválidos");

    const keys = Object.keys(criteria) as Array<keyof Partial<DefRemaining>>;
    for (const key of keys) {
      if (criteria[key] === undefined) continue;

      if (typeof criteria[key] === "number") {
        const validation = this.validateFloat({
          valueName: this.translateKey(key),
          input: String(criteria[key]),
        });

        if (validation.msg !== undefined) msg.push(validation.msg);
      }

      if (typeof criteria[key] === "number") {
        const validation = this.validateFloat({
          valueName: key,
          input: String(criteria[key]),
        });

        if (validation.msg !== undefined) msg.push(validation.msg);
        continue;
      }

      if (key === "date_time") {
        const validation = this.validateDate(String(criteria[key]));
        if (validation.msg !== undefined) msg.push(validation.msg);
        continue;
      }
    }

    if (msg.length > 0) throw new UserError(msg.join(", "));

    return await this.repo.getBy(criteria, page as number);
  }
}
