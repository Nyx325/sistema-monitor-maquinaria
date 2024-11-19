import { CumulativeLoadCount } from "@prisma/client";
import { NewCLC } from "../../entities/NewCumulativeLoadCount.js";
import { Repository } from "../use_cases/Repository.js";
import { PrismaClient } from "@prisma/client";
import { PrismaConnector } from "../../../controller/infraestructure/PrismaConnector.js";
import { IConnector } from "../../../controller/use_cases/IConnector.js";
import { Search } from "../../entities/Search.js";
import Config from "../../../config.js";

export class PrismaCLCRepository extends Repository<
  CumulativeLoadCount,
  NewCLC,
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

  async add(model: NewCLC): Promise<CumulativeLoadCount> {
    return this.executeWithConnection((conn) =>
      conn.cumulativeLoadCount.create({ data: model }),
    );
  }

  async update(model: CumulativeLoadCount): Promise<void> {
    await this.executeWithConnection((conn) =>
      conn.cumulativeLoadCount.update({
        where: { clo_id: model.clo_id },
        data: model,
      }),
    );
  }

  async delete(model: CumulativeLoadCount): Promise<void> {
    model.active = false;
    await this.update(model);
  }

  async get(id: number): Promise<CumulativeLoadCount | undefined> {
    return this.executeWithConnection(async (conn) => {
      const result = await conn.cumulativeLoadCount.findFirst({
        where: { clo_id: id },
      });
      return result ?? undefined;
    });
  }

  async getBy(
    criteria: Partial<CumulativeLoadCount>,
    pageNumber: number,
  ): Promise<Search<CumulativeLoadCount>> {
    return this.executeWithConnection(async (conn) => {
      const dateFilter =
        criteria.date_time !== undefined
          ? this.getDateFilter(criteria.date_time)
          : undefined;

      const where = {
        date_time: dateFilter,
        active: criteria.active,
        count: criteria.count,
      };

      const [totalResults, results] = await Promise.all([
        conn.cumulativeLoadCount.count({
          where,
        }),
        conn.cumulativeLoadCount.findMany({
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
    criteria: Partial<CumulativeLoadCount>,
    pageNumber: number,
  ): Promise<Search<CumulativeLoadCount>> {
    return await this.getBy(criteria, pageNumber);
  }
}
