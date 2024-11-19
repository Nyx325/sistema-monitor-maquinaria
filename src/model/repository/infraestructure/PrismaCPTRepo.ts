import { Repository } from "../use_cases/Repository.js";
import { CumulativePayloadTotals, PrismaClient } from "@prisma/client";
import { PrismaConnector } from "../../../controller/infraestructure/PrismaConnector.js";
import { IConnector } from "../../../controller/use_cases/IConnector.js";
import { Search } from "../../entities/Search.js";
import Config from "../../../config.js";
import { NewCPT } from "../../entities/NewCumulativePayloadTotals.js";

export class PrismaCPTRepository extends Repository<
  CumulativePayloadTotals,
  NewCPT,
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

  async add(model: NewCPT): Promise<CumulativePayloadTotals> {
    return this.executeWithConnection((conn) =>
      conn.cumulativePayloadTotals.create({ data: model }),
    );
  }

  async update(model: CumulativePayloadTotals): Promise<void> {
    await this.executeWithConnection((conn) =>
      conn.cumulativePayloadTotals.update({
        where: { cpt_id: model.cpt_id },
        data: model,
      }),
    );
  }

  async delete(model: CumulativePayloadTotals): Promise<void> {
    model.active = false;
    await this.update(model);
  }

  async get(id: number): Promise<CumulativePayloadTotals | undefined> {
    return this.executeWithConnection(async (conn) => {
      const result = await conn.cumulativePayloadTotals.findFirst({
        where: { cpt_id: id },
      });
      return result ?? undefined;
    });
  }

  async getBy(
    criteria: Partial<CumulativePayloadTotals>,
    pageNumber: number,
  ): Promise<Search<CumulativePayloadTotals>> {
    return this.executeWithConnection(async (conn) => {
      const dateFilter =
        criteria.date_time !== undefined
          ? this.getDateFilter(criteria.date_time)
          : undefined;

      const where = {
        date_time: dateFilter,
        active: criteria.active,
        payload_units:
          criteria.payload_units !== undefined
            ? { contains: criteria.payload_units }
            : undefined,
        payload: criteria.payload,
      };

      const [totalResults, results] = await Promise.all([
        conn.cumulativePayloadTotals.count({
          where,
        }),
        conn.cumulativePayloadTotals.findMany({
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
    criteria: Partial<CumulativePayloadTotals>,
    pageNumber: number,
  ): Promise<Search<CumulativePayloadTotals>> {
    return await this.getBy(criteria, pageNumber);
  }
}
