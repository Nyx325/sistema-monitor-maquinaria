import { DefRemaining } from "@prisma/client";
import { NewDefRemaining } from "../../entities/NewDefRemaining.js";
import { Repository } from "../use_cases/Repository.js";
import { PrismaClient } from "@prisma/client";
import { PrismaConnector } from "../../../controller/infraestructure/PrismaConnector.js";
import { IConnector } from "../../../controller/use_cases/IConnector.js";
import { Search } from "../../entities/Search.js";
import Config from "../../../config.js";

export class PrismaDEFRemainingRepository extends Repository<
  DefRemaining,
  NewDefRemaining,
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

  async add(model: NewDefRemaining): Promise<DefRemaining> {
    return this.executeWithConnection((conn) =>
      conn.defRemaining.create({ data: model }),
    );
  }

  async update(model: DefRemaining): Promise<void> {
    await this.executeWithConnection((conn) =>
      conn.defRemaining.update({
        where: { def_remaining_id: model.def_remaining_id },
        data: model,
      }),
    );
  }

  async delete(model: DefRemaining): Promise<void> {
    model.active = false;
    await this.update(model);
  }

  async get(id: number): Promise<DefRemaining | undefined> {
    return this.executeWithConnection(async (conn) => {
      const result = await conn.defRemaining.findFirst({
        where: { def_remaining_id: id },
      });
      return result ?? undefined;
    });
  }

  async getBy(
    criteria: Partial<DefRemaining>,
    pageNumber: number,
  ): Promise<Search<DefRemaining>> {
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
        conn.defRemaining.count({
          where,
        }),
        conn.defRemaining.findMany({
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
    criteria: Partial<DefRemaining>,
    pageNumber: number,
  ): Promise<Search<DefRemaining>> {
    return await this.getBy(criteria, pageNumber);
  }
}
