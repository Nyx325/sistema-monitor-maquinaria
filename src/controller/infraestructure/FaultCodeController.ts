import { Request } from "express";
import { PrismaEquipementRepo } from "../../model/repository/infraestructure/PrismaEquipementRepository.js";
import PrismaSnapshotRepository from "../../model/repository/infraestructure/PrismaSnapshotRepository.js";
import { IEquipementRepository } from "../../model/repository/use_cases/IEquipementRepository.js";
import { ISnapshotRepository } from "../../model/repository/use_cases/ISnapshotRepository.js";
import { Controller } from "../use_cases/Controller.js";
import { ApiSnapshot, FaultCode, Equipement } from "@prisma/client";
import UserError from "../../model/entities/UserError.js";
import { IFaultCodeRepository } from "../../model/repository/use_cases/IFaultCode.js";
import { PrismaFaultCodeRepository } from "../../model/repository/infraestructure/PrismaFaultCodeRepo.js";
import { NewFaultCode } from "../../model/entities/NewFaultCode.js";

export class FaultCodeController extends Controller {
  private readonly repo: IFaultCodeRepository = new PrismaFaultCodeRepository();
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
      code_identifier: "ID del codigo de error",
      code_description: "descripción del error",
      code_severity: "gravedad del error",
      code_source: "fuente del error",
      air_temperature: "temperatura del aire",
      temperature_unit: "unidades de la temperatura",
    };

    return campos[key] ?? defaultVal;
  }

  protected async performAdd(r: Request): Promise<void> {
    const {
      date_time,
      code_identifier,
      code_description,
      code_severity,
      code_source,
      air_temperature,
      temperature_unit,
      serial_number,
    } = r.body;

    const record: Partial<NewFaultCode> = {
      date_time: new Date(date_time),
      code_identifier,
      code_description,
      code_severity,
      code_source,
      air_temperature,
      temperature_unit,
      snapshot_id: null,
    };

    const msg = [];

    if (isNaN(Date.parse(date_time)))
      msg.push("Formato de fecha y hora inválidos");

    const keys = Object.keys(record) as Array<keyof NewFaultCode>;
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
    await this.repo.add(record as NewFaultCode);
  }

  protected async performUpdate(r: Request): Promise<void> {
    const {
      date_time,
      code_identifier,
      code_description,
      code_severity,
      code_source,
      air_temperature,
      temperature_unit,
      active,
    } = r.body;

    const record: Partial<FaultCode> = {
      active: active !== "false",
      date_time: new Date(date_time),
      snapshot_id: null,
      code_identifier,
      code_description,
      code_severity,
      code_source,
      air_temperature,
      temperature_unit,
    };

    const msg = [];

    if (isNaN(Date.parse(date_time)))
      msg.push("formato de fecha y hora inválidos");

    if (isNaN(Number(air_temperature)))
      msg.push("La temperatura del aire debe ser un número");

    const keys = Object.keys(record) as Array<keyof FaultCode>;
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

    const original = await this.repo.get(record.folio as number);
    if (original === undefined) msg.push("el registro a modificar no existe");
    if (msg.length > 0) throw new UserError(msg.join(", "));

    record.snapshot_id = original?.snapshot_id as number;
    await this.repo.update(record as FaultCode);
  }

  protected async performDetele(r: Request): Promise<void> {
    const { id } = r.params;

    if (!id) throw new UserError("No se proporcionó un ID");

    const validation = this.validateInt({
      input: id,
      valueName: "localización",
      positiveNumber: false,
    });

    if (validation.msg) throw new UserError(validation.msg);

    const record = await this.repo.get(validation.number as number);

    if (record === undefined) throw new UserError("Registro no encontrado");

    await this.repo.delete(record);
  }

  protected async performGet(r: Request): Promise<unknown | undefined> {
    const { id } = r.params;
    if (!id) throw new UserError("El ID no fue proporcionado");

    const validation = this.validateInt({
      input: id,
      valueName: "ID del registro",
      positiveNumber: false,
    });

    if (validation.msg) throw new UserError(validation.msg);

    return await this.repo.get(validation.number as number);
  }

  protected async performGetBy(r: Request): Promise<unknown> {
    const {
      dateTime,
      active,
      codeIdentifier,
      codeDescription,
      codeSeverity,
      codeSource,
      airTemperature,
      temperatureUnit,
      pageNumber = "1",
    } = r.query;

    const msg = [];

    const criteria: Partial<FaultCode> = {
      active: active !== undefined ? active !== "false" : undefined,
      date_time: dateTime !== undefined ? new Date(`${dateTime}`) : undefined,
      code_identifier:
        codeIdentifier !== undefined ? `${codeIdentifier}` : undefined,
      code_description:
        codeDescription !== undefined ? `${codeDescription}` : undefined,
      code_severity: codeSeverity !== undefined ? `${codeSeverity}` : undefined,
      code_source: codeSource !== undefined ? `${codeSource}` : undefined,
      air_temperature:
        airTemperature !== undefined ? `${airTemperature}` : undefined,
      temperature_unit:
        temperatureUnit !== undefined ? `${temperatureUnit}` : undefined,
    };

    const validation = this.validateInt({
      input: `${pageNumber}`,
      valueName: "número de página",
      positiveNumber: true,
    });

    if (dateTime !== undefined && isNaN(Date.parse(String(dateTime))))
      msg.push("formato de fecha y hora inválidos");

    const keys = Object.keys(criteria) as Array<keyof FaultCode>;
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
