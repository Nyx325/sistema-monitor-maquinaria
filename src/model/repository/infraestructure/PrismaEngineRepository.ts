import { EngineStatus } from "@prisma/client";
import { Repository } from "../use_cases/Repository.js";
import { NewEngineStatus } from "../../entities/NewEngineStatus.js";
import { IConnector } from "../../../controller/use_cases/IConnector.js";
import { PrismaClient } from "@prisma/client";
import { PrismaConnector } from "../../../controller/infraestructure/PrismaConnector.js";
import Config from "../../../config.js";
import { Search } from "../../entities/Search.js";

export class PrismaEngineRepo extends Repository<
  EngineStatus,
  NewEngineStatus,
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

  async add(model: NewEngineStatus): Promise<EngineStatus> {
    return this.executeWithConnection((conn) =>
      conn.engineStatus.create({ data: model }),
    );
  }

  async update(model: EngineStatus): Promise<void> {
    await this.executeWithConnection((conn) =>
      conn.engineStatus.update({
        where: { engine_status_id: model.engine_status_id },
        data: model,
      }),
    );
  }

  async delete(model: EngineStatus): Promise<void> {
    model.active = false;
    return this.update(model);
  }

  async get(id: number): Promise<EngineStatus | undefined> {
    return this.executeWithConnection(async (conn) => {
      const result = await conn.engineStatus.findFirst({
        where: { engine_status_id: id },
      });
      return result ?? undefined;
    });
  }

  async getBy(
    criteria: Partial<EngineStatus>,
    pageNumber: number,
  ): Promise<Search<EngineStatus>> {
    return this.executeWithConnection(async (conn) => {
      const dateFilter =
        criteria.date_time !== undefined
          ? this.getDateFilter(criteria.date_time)
          : undefined;

      const where = {
        date_time: dateFilter,
        active: criteria.active,
        running: criteria.running,
        engine_number: criteria.engine_number
          ? { contains: criteria.engine_number }
          : undefined,
      };

      const [totalResults, results] = await Promise.all([
        conn.engineStatus.count({
          where,
        }),
        conn.engineStatus.findMany({
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
    criteria: Partial<EngineStatus>,
    pageNumber: number,
  ): Promise<Search<EngineStatus>> {
    return await this.getBy(criteria, pageNumber);
  }
}
