import { Repository } from "../use_cases/Repository.js";
import { FaultCode, PrismaClient } from "@prisma/client";
import { PrismaConnector } from "../../../controller/infraestructure/PrismaConnector.js";
import { IConnector } from "../../../controller/use_cases/IConnector.js";
import { Search } from "../../entities/Search.js";
import Config from "../../../config.js";
import { NewFaultCode } from "../../entities/NewFaultCode.js";

export class PrismaFaultCodeRepository extends Repository<
  FaultCode,
  NewFaultCode,
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

  async add(model: NewFaultCode): Promise<FaultCode> {
    return this.executeWithConnection((conn) =>
      conn.faultCode.create({ data: model }),
    );
  }

  async update(model: FaultCode): Promise<void> {
    await this.executeWithConnection((conn) =>
      conn.faultCode.update({
        where: { folio: model.folio },
        data: model,
      }),
    );
  }

  async delete(model: FaultCode): Promise<void> {
    model.active = false;
    await this.update(model);
  }

  async get(id: number): Promise<FaultCode | undefined> {
    return this.executeWithConnection(async (conn) => {
      const result = await conn.faultCode.findFirst({
        where: { folio: id },
      });
      return result ?? undefined;
    });
  }

  async getBy(
    criteria: Partial<FaultCode>,
    pageNumber: number,
  ): Promise<Search<FaultCode>> {
    return this.executeWithConnection(async (conn) => {
      const dateFilter =
        criteria.date_time !== undefined
          ? this.getDateFilter(criteria.date_time)
          : undefined;

      const where = {
        date_time: dateFilter,
        active: criteria.active,
        code_source:
          criteria.code_source !== undefined
            ? { contains: criteria.code_source }
            : undefined,
        code_severity:
          criteria.code_severity !== undefined
            ? { contains: criteria.code_severity }
            : undefined,
        code_identifier:
          criteria.code_identifier !== undefined
            ? { contains: criteria.code_identifier }
            : undefined,
        code_description:
          criteria.code_description !== undefined
            ? { contains: criteria.code_description }
            : undefined,
        air_temperature: criteria.air_temperature,
        temperature_unit:
          criteria.temperature_unit !== undefined
            ? { contains: criteria.temperature_unit }
            : undefined,
      };

      const [totalResults, results] = await Promise.all([
        conn.faultCode.count({
          where,
        }),
        conn.faultCode.findMany({
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
    criteria: Partial<FaultCode>,
    pageNumber: number,
  ): Promise<Search<FaultCode>> {
    return await this.getBy(criteria, pageNumber);
  }
}
