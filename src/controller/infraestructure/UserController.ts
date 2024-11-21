import { Request, Response } from "express";
import { IUserRepository } from "../../model/repository/use_cases/IUserRepository.js";
import { Controller } from "../use_cases/Controller.js";
import { $Enums, User } from "@prisma/client";
import { NewUser } from "../../model/entities/NewUser.js";
import UserError from "../../model/entities/UserError.js";
import { PrismaUserRepository } from "../../model/repository/infraestructure/PrismaUserRepository.js";

export class UserController extends Controller {
  private readonly repo: IUserRepository = new PrismaUserRepository();

  translateKey(key: string): string {
    const defaultVal = "campo desconocido";

    const campos: { [key: string]: string } = {
      active: "activo o inactivo",
      user_id: "ID del usuario",
      full_name: "nombre completo del usuario",
      user_name: "nombre de usuario",
      user_password: "contraseña",
      user_type: "tipo usuario",
      email: "correo electrónico",
    };

    return campos[key] ?? defaultVal;
  }

  /**
   * Valida si un string pertenece a un enum de Prisma.
   *
   * @param value - El valor que deseas validar.
   * @param enumType - El enum de Prisma contra el cual validar.
   * @returns La instancia válida del enum o undefined si no pertenece.
   */
  validateEnumValue(value: string | undefined): $Enums.UserType | undefined {
    for (const opt of Object.values($Enums.UserType))
      if (value?.toUpperCase() === opt) return $Enums.UserType[opt];
    return undefined;
  }

  protected async performAdd(r: Request): Promise<void> {
    const { full_name, user_name, user_password, user_type, email } = r.body;
    const record: Partial<NewUser> = {
      email,
      full_name,
      user_name,
      user_type,
      user_password,
    };

    const msg = [];

    record.user_type = this.validateEnumValue(record.user_type);
    if (record.user_type === undefined) msg.push("tipo de usuario inválido");

    const keys = Object.keys(record) as Array<keyof NewUser>;
    for (const key of keys) {
      if (key !== "user_type" && record[key] === undefined)
        msg.push(`${this.translateKey(key)} no fue definido`);
    }

    if (msg.length > 0) throw new UserError(msg.join(", "));

    await this.repo.add(record as NewUser);
  }

  protected async performUpdate(r: Request): Promise<void> {
    const {
      user_id,
      full_name,
      user_name,
      user_password,
      user_type,
      active,
      email,
    } = r.body;

    const record: Partial<User> = {
      user_id: user_id !== undefined ? Number(user_id) : undefined,
      full_name,
      user_name,
      user_password,
      user_type,
      active,
      email,
    };

    const msg = [];

    record.user_type = this.validateEnumValue(record.user_type);
    if (record.user_type === undefined) msg.push("tipo de usuario inválido");

    const keys = Object.keys(record) as Array<keyof User>;
    for (const key of keys) {
      if (key !== "user_type" && record[key] === undefined) {
        msg.push(`${this.translateKey(key)} no fue definido`);
        continue;
      }

      if (typeof record[key] === "number" && isNaN(record[key])) {
        msg.push(`${this.translateKey(key)} debe ser un numero entre 0 y 100`);
        continue;
      }
    }

    const original = await this.repo.get(Number(record.user_id));
    if (original === undefined) msg.push("el registro a modificar no existe");
    if (msg.length > 0) throw new UserError(msg.join(", "));

    await this.repo.update(record as User);
  }

  protected async performDetele(r: Request): Promise<void> {
    const { id } = r.params;

    const validation = this.validateInt({
      input: id,
      valueName: "ID del registro",
      positiveNumber: false,
    });

    if (validation.msg) throw new UserError(validation.msg);

    const record = await this.repo.get(validation.number as number);

    if (record === undefined) throw new UserError("No se encontró el registro");

    await this.repo.delete(record);
  }

  protected async performGet(r: Request): Promise<unknown | undefined> {
    const { id } = r.params;

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
      userId,
      fullName,
      userName,
      userType,
      active,
      email,
      pageNumber = "1",
    } = r.query;

    const criteria: Partial<User> = {
      active: active !== "false",
      user_id: userId !== undefined ? Number(userId) : undefined,
      full_name: fullName !== undefined ? `${fullName}` : undefined,
      user_name: userName !== undefined ? `${userName}` : undefined,
      user_type: this.validateEnumValue(`${userType}`),
      email: email !== undefined ? `${email}` : undefined,
    };

    const msg = [];

    const validation = this.validateInt({
      input: pageNumber as string,
      valueName: "numero de página",
      positiveNumber: true,
    });

    if (validation.msg) msg.push(validation.msg);
    const page = validation.number;

    const keys = Object.keys(criteria) as Array<keyof Partial<User>>;
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
    }

    if (msg.length > 0) throw new UserError(msg.join(", "));

    return await this.repo.getBy(criteria, page as number);
  }

  async auth(req: Request, res: Response) {
    try {
      const { user_name, user_password } = req.body;
      const msg = [];
      if (user_name === undefined) msg.push("nombre de usuario no definido");
      if (user_password === undefined) msg.push("contraseña no definida");

      if (msg.length !== 0) throw new UserError(msg.join(", "));
      const usr = await this.repo.getUser(`${user_name}`, `${user_password}`);

      if (usr === null) {
        res.status(404).json();
        return;
      }

      res.status(200).json({
        user_id: usr.user_id,
        user_name: usr.user_name,
        full_name: usr.full_name,
        email: usr.email,
        user_type: usr.user_type,
      });
    } catch (e) {
      this.handleError(e, res);
    }
  }
}
