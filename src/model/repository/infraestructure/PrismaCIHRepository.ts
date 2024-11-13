import { CumulativeIdleHours, PrismaClient } from "@prisma/client";
import { Repository } from "../use_cases/Repository.js";
import { NewCIH } from "../../entities/NewCumulativeIdleHours.js";
import { IConnector } from "../../../controller/use_cases/IConnector.js";
import { PrismaConnector } from "../../../controller/infraestructure/PrismaConnector.js";
import { Search } from "../../entities/Search.js";
import Config from "../../../config.js";

export class PrismaCIHRepository extends Repository<
  CumulativeIdleHours,
  NewCIH,
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

  async add(model: NewCIH): Promise<CumulativeIdleHours> {
    // a función de callback (deja implícito el retorno):
    return this.executeWithConnection((conn) =>
      conn.cumulativeIdleHours.create({ data: model }),
    );
  }

  async update(model: CumulativeIdleHours): Promise<void> {
    console.log("A");
    await this.executeWithConnection((conn) => {
      console.log(model);
      console.log();
      return conn.cumulativeIdleHours.update({
        where: { cih_id: model.cih_id },
        data: model,
      });
    });
  }

  async delete(model: CumulativeIdleHours): Promise<void> {
    model.active = false;
    await this.update(model);
  }

  async get(id: number): Promise<CumulativeIdleHours | undefined> {
    return this.executeWithConnection(async (conn) => {
      const result = await conn.cumulativeIdleHours.findFirst({
        where: { cih_id: id },
      });
      return result ?? undefined;
    });
  }

  async getBy(
    criteria: Partial<CumulativeIdleHours>,
    pageNumber: number,
  ): Promise<Search<CumulativeIdleHours>> {
    return this.executeWithConnection(async (conn) => {
      const dateFilter =
        criteria.date_time !== undefined
          ? this.getDateFilter(criteria.date_time)
          : undefined;

      const where = {
        date_time: dateFilter,
        active: criteria.active,
        hour: criteria.hour,
        snapshot_id: criteria.snapshot_id,
      };

      const [totalResults, results] = await Promise.all([
        conn.cumulativeIdleHours.count({ where }),
        conn.cumulativeIdleHours.findMany({
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
    criteria: Partial<CumulativeIdleHours>,
    pageNumber: number,
  ): Promise<Search<CumulativeIdleHours>> {
    return await this.getBy(criteria, pageNumber);
  }
}
