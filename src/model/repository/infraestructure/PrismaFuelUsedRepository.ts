import { FuelUsed } from "@prisma/client";
import { NewFuelUsed } from "../../entities/NewFuelUsed.js";
import { Repository } from "../use_cases/Repository.js";
import { IConnector } from "../../../controller/use_cases/IConnector.js";
import { PrismaClient } from "@prisma/client";
import { PrismaConnector } from "../../../controller/infraestructure/PrismaConnector.js";
import { Search } from "../../entities/Search.js";
import Config from "../../../config.js";

export class PrismaFuelUsedRepository extends Repository<
  FuelUsed,
  NewFuelUsed,
  number
> {
  private readonly connector: IConnector<PrismaClient>;

  constructor() {
    super();
    this.connector = new PrismaConnector();
  }

  async add(model: NewFuelUsed): Promise<FuelUsed> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();
      const record = await conn.fuelUsed.create({ data: model });
      return record;
    } catch (error) {
      console.error(`Repository: ${error}`);
      throw error;
    } finally {
      if (conn !== null) this.connector.releaseConnection(conn);
    }
  }

  async update(model: FuelUsed): Promise<void> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();
      await conn.fuelUsed.update({
        where: {
          fuel_used_id: model.fuel_used_id,
        },
        data: model,
      });
    } catch (error) {
      console.error(`Repository: ${error}`);
      throw error;
    } finally {
      if (conn !== null) this.connector.releaseConnection(conn);
    }
  }

  async delete(model: FuelUsed): Promise<void> {
    model.active = false;
    await this.update(model);
  }

  async get(id: number): Promise<FuelUsed | undefined> {
    let conn: PrismaClient | null = null;

    try {
      conn = await this.connector.getConnection();

      const result = await conn.fuelUsed.findFirst({
        where: {
          fuel_used_id: id,
        },
      });

      return result ?? undefined;
    } catch (error) {
      console.error(`Repository: ${error}`);
      throw error;
    } finally {
      if (conn !== null) this.connector.releaseConnection(conn);
    }
  }

  async getBy(
    criteria: Partial<FuelUsed>,
    pageNumber: number,
  ): Promise<Search<FuelUsed>> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();

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
        conn.fuelUsed.count({
          where,
        }),
        conn.fuelUsed.findMany({
          where,
          include: { snapshot: true },
          orderBy: { date_time: "desc" },
          skip: (pageNumber - 1) * Config.instance.pageSize, // Skip previous pages
          take: Config.instance.pageSize, // Take only the results for the current page
        }),
      ]);

      const totalPages = Math.ceil(totalResults / Config.instance.pageSize);

      return {
        totalPages: totalPages,
        currentPage: pageNumber,
        criteria: criteria,
        result: results.length > 0 ? results : [],
      };
    } catch (error) {
      console.error(`Repository: ${error}`);
      throw error;
    } finally {
      if (conn !== null) this.connector.releaseConnection(conn);
    }
  }

  async specificSearch(
    criteria: Partial<FuelUsed>,
    pageNumber: number,
  ): Promise<Search<FuelUsed>> {
    return await this.getBy(criteria, pageNumber);
  }
}
