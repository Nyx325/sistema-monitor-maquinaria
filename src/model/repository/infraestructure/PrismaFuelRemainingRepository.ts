import { FuelRemaining } from "@prisma/client";
import { Repository } from "../use_cases/Repository.js";
import { NewFuelRemaining } from "../../entities/NewFuelRemaining.js";
import { PrismaClient } from "@prisma/client";
import { PrismaConnector } from "../../../controller/infraestructure/PrismaConnector.js";
import { IConnector } from "../../../controller/use_cases/IConnector.js";
import { Search } from "../../entities/Search.js";
import Config from "../../../config.js";

export class PrismaFuelRemainingRepository extends Repository<
  FuelRemaining,
  NewFuelRemaining,
  number
> {
  private readonly connector: IConnector<PrismaClient>;

  constructor() {
    super();
    this.connector = new PrismaConnector();
  }

  private async executeWithConnection<T>(
    action: (conn: PrismaClient) => Promise<T>,
  ): Promise<T> {
    {
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
  }

  async add(model: NewFuelRemaining): Promise<FuelRemaining> {
    return this.executeWithConnection((conn) =>
      conn.fuelRemaining.create({ data: model }),
    );
  }

  async update(model: FuelRemaining): Promise<void> {
    await this.executeWithConnection((conn) =>
      conn.fuelRemaining.update({
        where: { fuel_remaining_id: model.fuel_remaining_id },
        data: model,
      }),
    );
  }

  async delete(model: FuelRemaining): Promise<void> {
    model.active = false;
    await this.update(model);
  }

  async get(id: number): Promise<FuelRemaining | undefined> {
    return this.executeWithConnection(async (conn) => {
      const result = await conn.fuelRemaining.findFirst({
        where: { fuel_remaining_id: id },
      });
      return result ?? undefined;
    });
  }

  async getBy(
    criteria: Partial<FuelRemaining>,
    pageNumber: number,
  ): Promise<Search<FuelRemaining>> {
    return this.executeWithConnection(async (conn) => {
      const dateFilter =
        criteria.date_time !== undefined
          ? this.getDateFilter(criteria.date_time)
          : undefined;

      const where = {
        date_time: dateFilter,
        active: criteria.active,
        percent: criteria.percent,
      };

      const [totalResults, results] = await Promise.all([
        conn.fuelRemaining.count({
          where,
        }),
        conn.fuelRemaining.findMany({
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
    criteria: Partial<FuelRemaining>,
    pageNumber: number,
  ): Promise<Search<FuelRemaining>> {
    return await this.getBy(criteria, pageNumber);
  }
}
