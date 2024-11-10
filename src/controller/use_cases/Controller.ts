import { Request, Response } from "express";
import UserError from "../../model/entities/UserError.js";
import { IController } from "./IController.js";

export abstract class Controller implements IController {
  protected abstract performAdd(r: Request): Promise<void>;
  protected abstract performUpdate(r: Request): Promise<void>;
  protected abstract performDetele(r: Request): Promise<void>;
  protected abstract performGet(r: Request): Promise<unknown | undefined>;
  protected abstract performGetBy(r: Request): Promise<unknown>;

  protected handleError(e: unknown, res: Response) {
    if (e instanceof UserError) {
      res.status(400).json({ message: e.message });
    } else {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async add(req: Request, res: Response): Promise<void> {
    try {
      await this.performAdd(req);
      res.status(201).json({ message: "Registro creado correctamente" });
    } catch (e) {
      this.handleError(e, res);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      await this.performUpdate(req);
      res.status(200).json({ message: "Registro creado correctamente" });
    } catch (e) {
      this.handleError(e, res);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await this.performDetele(req);
      res.status(200).json({ message: "Registro eliminado con éxito" });
    } catch (e) {
      this.handleError(e, res);
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.performGet(req);
      if (result === undefined)
        res.status(404).json({ message: "No se encontró el registro" });
      else res.status(200).json(result);
    } catch (e) {
      this.handleError(e, res);
    }
  }

  async getBy(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.performGetBy(req);
      res.status(200).json(result);
    } catch (e) {
      this.handleError(e, res);
    }
  }

  validateInt(opts: {
    input: string | undefined;
    valueName: string;
    positiveNumber: boolean;
  }): {
    number: number | undefined;
    msg: string | undefined;
  } {
    // Validación de existencia de input
    if (!opts.input) {
      return { number: undefined, msg: `${opts.valueName} no fue definido` };
    }

    // Intento de parseo de input
    const num = parseInt(opts.input, 10);

    // Validación de que sea un número entero
    if (isNaN(num)) {
      return { number: undefined, msg: `${opts.valueName} debe ser un número` };
    }

    // Validación de número positivo si es requerido
    if (opts.positiveNumber && num < 0) {
      return {
        number: num,
        msg: `${opts.valueName} debe ser un número positivo`,
      };
    }

    return { number: num, msg: undefined };
  }

  validateFloat(opts: { input: string | undefined; valueName: string }): {
    number: number | undefined;
    msg: string | undefined;
  } {
    // Validación de existencia de input
    if (!opts.input) {
      return { number: undefined, msg: `${opts.valueName} no fue definido` };
    }

    // Intento de parseo de input
    const num = parseFloat(opts.input);

    // Validación de que sea un número entero
    if (isNaN(num)) {
      return { number: undefined, msg: `${opts.valueName} debe ser un número` };
    }

    return { number: num, msg: undefined };
  }

  validateDate(date: string | undefined): {
    date: Date | undefined;
    msg: string | undefined;
  } {
    if (!date || isNaN(Date.parse(date)))
      return {
        date: undefined,
        msg: "Formato de fecha y hora inválido",
      };

    return {
      date: new Date(date),
      msg: undefined,
    };
  }
}
