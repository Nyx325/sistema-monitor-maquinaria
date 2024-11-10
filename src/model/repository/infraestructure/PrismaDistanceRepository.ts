import { Distance } from "@prisma/client";
import { Repository } from "../use_cases/Repository.js";
import { NewDistance } from "../../entities/NewDistance.js";
import { PrismaConnector } from "../../../controller/infraestructure/PrismaConnector.js";
import { IConnector } from "../../../controller/use_cases/IConnector.js";
import { PrismaClient } from "@prisma/client";
import { Search } from "../../entities/Search.js";
import Config from "../../../config.js";

export class PrismaDistanceRepository extends Repository<
  Distance,
  NewDistance,
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

  async add(model: NewDistance): Promise<Distance> {
    return this.executeWithConnection((conn) =>
      conn.distance.create({ data: model }),
    );
  }

  async update(model: Distance): Promise<void> {
    await this.executeWithConnection((conn) =>
      conn.distance.update({
        where: { distance_id: model.distance_id },
        data: model,
      }),
    );
  }

  async delete(model: Distance): Promise<void> {
    model.active = false;
    await this.update(model);
  }

  async get(id: number): Promise<Distance | undefined> {
    return this.executeWithConnection(async (conn) => {
      const result = await conn.distance.findFirst({
        where: { distance_id: id },
      });
      return result ?? undefined;
    });
  }

  async getBy(
    criteria: Partial<Distance>,
    pageNumber: number,
  ): Promise<Search<Distance>> {
    return this.executeWithConnection(async (conn) => {
      const dateFilter =
        criteria.date_time !== undefined
          ? this.getDateFilter(criteria.date_time)
          : undefined;

      const where = {
        date_time: dateFilter,
        active: criteria.active,
        odometer: criteria.odometer,
        odometer_units: criteria.odometer_units
          ? { contains: criteria.odometer_units }
          : undefined,
      };

      const [totalResults, results] = await Promise.all([
        conn.distance.count({ where }),
        conn.distance.findMany({
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
    criteria: Partial<Distance>,
    pageNumber: number,
  ): Promise<Search<Distance>> {
    return await this.getBy(criteria, pageNumber);
  }
}
