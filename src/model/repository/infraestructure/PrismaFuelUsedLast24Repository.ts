import { FuelUsedLast24 } from "@prisma/client";
import { NewFuelUsedLast24 } from "../../entities/NewFuelUsedLast24.js";
import { Repository } from "../use_cases/Repository.js";
import { IConnector } from "../../../controller/use_cases/IConnector.js";
import { PrismaClient } from "@prisma/client";
import { PrismaConnector } from "../../../controller/infraestructure/PrismaConnector.js";
import { Search } from "../../entities/Search.js";
import Config from "../../../config.js";

export class PrismaFuelUsedLast24Repository extends Repository<
  FuelUsedLast24,
  NewFuelUsedLast24,
  number
> {
  private readonly connector: IConnector<PrismaClient>;

  constructor() {
    super();
    this.connector = new PrismaConnector();
  }

  /* Método para manejar la conexión y captura de errores
   *
   * En TypeScript, T es un tipo genérico, y su funcionamiento se
   * basa en la capacidad de inferencia de tipos del lenguaje.
   * Cuando defines un genérico en una función (como
   * executeWithConnection<T>), estás creando una plantilla de
   * tipo que se adapta automáticamente al tipo de dato que
   * recibe o devuelve la función, sin tener que especificarlo
   * explícitamente.
   */
  private async executeWithConnection<T>(
    action: (conn: PrismaClient) => Promise<T>,
  ): Promise<T> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();
      return await action(conn);
    } catch (error) {
      console.error(`Repository: ${error}`);
      throw error;
    } finally {
      if (conn !== null) this.connector.releaseConnection(conn);
    }
  }

  async add(model: NewFuelUsedLast24): Promise<FuelUsedLast24> {
    // a función de callback (deja implícito el retorno):
    return this.executeWithConnection((conn) =>
      conn.fuelUsedLast24.create({ data: model }),
    );
  }

  async update(model: FuelUsedLast24): Promise<void> {
    await this.executeWithConnection((conn) =>
      conn.fuelUsedLast24.update({
        where: { fuel_used_id: model.fuel_used_id },
        data: model,
      }),
    );
  }

  async delete(model: FuelUsedLast24): Promise<void> {
    model.active = false;
    await this.update(model);
  }

  async get(id: number): Promise<FuelUsedLast24 | undefined> {
    return this.executeWithConnection(async (conn) => {
      const result = await conn.fuelUsedLast24.findFirst({
        where: { fuel_used_id: id },
      });
      return result ?? undefined;
    });
  }

  async getBy(
    criteria: Partial<FuelUsedLast24>,
    pageNumber: number,
  ): Promise<Search<FuelUsedLast24>> {
    return this.executeWithConnection(async (conn) => {
      const dateFilter =
        criteria.date_time !== undefined
          ? this.getDateFilter(criteria.date_time)
          : undefined;

      const where = {
        fuel_consumed: criteria.fuel_consumed,
        date_time: dateFilter,
        fuel_units: criteria.fuel_units
          ? { contains: criteria.fuel_units }
          : undefined,
        active: criteria.active,
        snapshot_id: criteria.snapshot_id,
      };

      const [totalResults, results] = await Promise.all([
        conn.fuelUsedLast24.count({ where }),
        conn.fuelUsedLast24.findMany({
          where,
          include: { snapshot: true },
          orderBy: { date_time: "desc" },
          skip: (pageNumber - 1) * Config.instance.pageSize,
          take: Config.instance.pageSize,
        }),
      ]);

      const totalPages = Math.ceil(totalResults / Config.instance.pageSize);

      return {
        totalPages,
        currentPage: pageNumber,
        criteria,
        result: results.length > 0 ? results : [],
      };
    });
  }

  async specificSearch(
    criteria: Partial<FuelUsedLast24>,
    pageNumber: number,
  ): Promise<Search<FuelUsedLast24>> {
    return await this.getBy(criteria, pageNumber);
  }
}
